from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, world!"}

@app.get("/hello")
def say_hello():
    return {"message": "Hi from FastAPI!"}
