import chromadb
from chromadb.utils import embedding_functions
from metaflow import FlowSpec, step, Parameter

client = chromadb.PersistentClient()
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-mpnet-base-v2")
collection = client.get_or_create_collection(name="posts", embedding_function=sentence_transformer_ef)

class StorePostFlow(FlowSpec):

    @step
    def start(self):
        self.post = "What is the best computer for developers?"
        self.post_id = "61"
        self.next(self.store_post)

    @step
    def store_post(self):
        print(f"Storing post with ID '{self.post_id}'...")
        try:
            collection.add(ids=[self.post_id], documents=[self.post])
            print("Post stored successfully.")
        except Exception as e:
            print(f"Failed to store post: {str(e)}")
        self.next(self.end)

    @step
    def end(self):
        print("Flow completed successfully.")