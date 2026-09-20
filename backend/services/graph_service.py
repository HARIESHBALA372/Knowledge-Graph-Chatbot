from typing import Optional, Dict, Any, List
from backend.data.knowledge_store import KNOWLEDGE_GRAPH, DOCUMENTS_STORE

class GraphService:
    def __init__(self):
        self.nodes = KNOWLEDGE_GRAPH["nodes"]
        self.relationships = KNOWLEDGE_GRAPH["relationships"]

    def get_graph(self, entity_type: Optional[str] = None, search: Optional[str] = None) -> Dict[str, Any]:
        nodes = list(self.nodes)
        relationships = list(self.relationships)

        if entity_type and entity_type.lower() != "all":
            nodes = [n for n in nodes if n["type"].lower() == entity_type.lower()]
            node_ids = {n["id"] for n in nodes}
            relationships = [
                r for r in relationships 
                if r["source"] in node_ids and r["target"] in node_ids
            ]

        if search:
            q = search.lower()
            nodes = [
                n for n in nodes 
                if q in n["label"].lower() 
                or q in n["type"].lower() 
                or q in str(n.get("properties", {})).lower()
            ]
            node_ids = {n["id"] for n in nodes}
            relationships = [
                r for r in relationships 
                if r["source"] in node_ids or r["target"] in node_ids
            ]

        return {"nodes": nodes, "relationships": relationships}

    def get_entity(self, entity_id: str) -> Optional[Dict[str, Any]]:
        target_id = entity_id.lower()
        node = next(
            (n for n in self.nodes if n["id"].lower() == target_id or n["label"].lower() == target_id),
            None
        )
        if not node:
            return None

        node_dict = dict(node)
        incoming = []
        for r in self.relationships:
            if r["target"] == node["id"]:
                src_node = next((n for n in self.nodes if n["id"] == r["source"]), None)
                incoming.append({**r, "sourceNode": src_node})

        outgoing = []
        for r in self.relationships:
            if r["source"] == node["id"]:
                tgt_node = next((n for n in self.nodes if n["id"] == r["target"]), None)
                outgoing.append({**r, "targetNode": tgt_node})

        node_dict["incoming"] = incoming
        node_dict["outgoing"] = outgoing
        return node_dict

    def search_all(self, query: str) -> Dict[str, Any]:
        q = (query or "").lower()
        matched_nodes = [
            n for n in self.nodes 
            if q in n["label"].lower() or q in n["type"].lower() or q in str(n.get("properties", {})).lower()
        ]
        matched_rels = [
            r for r in self.relationships 
            if q in r["label"].lower() or q in r["source"].lower() or q in r["target"].lower()
        ]
        matched_docs = [
            d for d in DOCUMENTS_STORE 
            if q in d["name"].lower() or q in d["source"].lower()
        ]

        return {
            "entities": matched_nodes,
            "relationships": matched_rels,
            "documents": matched_docs
        }

    def find_subgraph_for_entities(self, entity_names_or_ids: List[str]) -> Dict[str, Any]:
        """Extract a coherent subgraph for a set of mentioned entities"""
        lowered = {e.lower() for e in entity_names_or_ids}
        matched_node_ids = set()
        for n in self.nodes:
            if n["id"].lower() in lowered or n["label"].lower() in lowered:
                matched_node_ids.add(n["id"])

        # If no specific matches, default to top 4 core nodes
        if not matched_node_ids:
            matched_node_ids = {"python", "deep_learning", "machine_learning", "artificial_intelligence"}

        # Include direct 1-hop connected neighbors
        subgraph_node_ids = set(matched_node_ids)
        subgraph_edges = []
        for r in self.relationships:
            if r["source"] in matched_node_ids or r["target"] in matched_node_ids:
                subgraph_edges.append(r)
                subgraph_node_ids.add(r["source"])
                subgraph_node_ids.add(r["target"])

        subgraph_nodes = [n for n in self.nodes if n["id"] in subgraph_node_ids]
        return {
            "nodes": subgraph_nodes[:8],
            "relationships": subgraph_edges[:10]
        }

graph_service = GraphService()
