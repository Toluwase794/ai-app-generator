from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import math
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Expression(BaseModel):
    expression: str

# Allowed names for eval
allowed_names = {
    'sin': math.sin,
    'cos': math.cos,
    'tan': math.tan,
    'sqrt': math.sqrt,
    'log10': math.log10,
    'ln': math.log,
    'log': math.log,
    'pi': math.pi,
    'e': math.e,
    '__builtins__': {}
}

@app.post('/evaluate')
async def evaluate_expression(expr: Expression):
    try:
        # Replace ln with log for math.log
        expression = expr.expression.replace('ln', 'log')

        # Evaluate safely
        result = eval(expression, allowed_names)

        # Format float results nicely
        if isinstance(result, float):
            result = round(result, 10)

        return {"result": result}
    except Exception:
        return {"error": "Invalid expression"}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
