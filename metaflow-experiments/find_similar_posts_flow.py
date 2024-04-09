import chromadb
from chromadb.utils import embedding_functions
from metaflow import FlowSpec, step, Parameter

client = chromadb.PersistentClient()
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-mpnet-base-v2")
collection = client.get_or_create_collection(name="posts", embedding_function=sentence_transformer_ef)

class FindSimilarPostsFlow(FlowSpec):

    @step
    def start(self):
        self.query = "security"
        self.next(self.find_similar_posts)

    @step
    def find_similar_posts(self):
        print(f"Searching for similar posts for query: '{self.query}'...")
        try:
            similar_posts = collection.query(query_texts=[self.query], n_results=10)
            print("Search completed. Here are the similar posts:")
            for i, post in enumerate(similar_posts['documents'][0]):
                print(f"{i + 1}. {post}")
        except Exception as e:
            print(f"Failed to find similar posts: {str(e)}")
        self.next(self.end)

    @step
    def end(self):
        print("Flow completed successfully.")