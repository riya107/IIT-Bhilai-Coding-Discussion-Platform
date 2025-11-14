from flask import Flask, request, jsonify
from flask_cors import CORS
import chromadb
from chromadb.utils import embedding_functions

app = Flask(__name__)

CORS(app)

client = chromadb.PersistentClient()
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-mpnet-base-v2"
)
collection = client.get_or_create_collection(
    name="posts", embedding_function=sentence_transformer_ef
)


@app.route("/store-post", methods=["POST"])
def store_post():
    if "id" not in request.get_json() or "post" not in request.get_json():
        return {"error": True, "message": "Missing required fields."}, 400

    id = request.get_json().get("id")
    post = request.get_json().get("post")

    collection.add(ids=[id], documents=[post])

    return {
        "error": False,
        "message": "Post is successfully stored in vector database.",
    }, 200


@app.route("/similar-posts", methods=["POST"])
def find_similar_posts():
    if "text" not in request.get_json():
        return {"error": True, "message": "Missing required fields."}, 400

    text = request.get_json().get("text")
    ids = (collection.query(query_texts=[text], n_results=10))['ids'][0]
    print(ids)
    return {
        "error": False,
        "message": "Matching results found.",
        "ids": ids,
    }, 200

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
