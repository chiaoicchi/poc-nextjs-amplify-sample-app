"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  function deleteTodo(id: string) {
      client.models.Todo.delete({ id })
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  return (
    <main className="flex flex-col items-stretch space-y-4 text-center">
      <h1 className="text-3xl font-bold">My todos</h1>
      <button
        onClick={createTodo}
        className="bg-[#1a1a1a] text-white font-medium text-base py-2 px-4 rounded-md border border-transparent hover:border-indigo-400 focus:outline focus:outline-4"
      >
        + new
      </button>
      <ul className="flex flex-col gap-px bg-black rounded-md border border-black overflow-auto">
        {todos.map((todo) => (
          <li
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}
            className="bg-white p-2 hover:bg-[#dadbf9] text-left"
          >
            {todo.content}
          </li>
        ))}
      </ul>
      <div className="mt-4 text-sm">
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a
          href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/"
          className="font-extrabold underline hover:text-indigo-500"
        >
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
}

