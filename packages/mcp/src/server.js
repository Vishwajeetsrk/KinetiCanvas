import {
  createProject,
  createScene,
  createTaskCue,
  addScene,
  addTaskCue,
  validateProject,
  CHARACTERS,
  getCharacterById,
} from "@kineticanvas/core";
import readline from "node:readline";

export const TOOLS = [
  {
    name: "kineticanvas_list_characters",
    description: "List all 6 KinetiCanvas companion characters with their powers, species, and archetype specs.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "kineticanvas_get_character",
    description: "Get comprehensive profile, individual powers, working style, and audio profile for a specific character.",
    inputSchema: {
      type: "object",
      required: ["characterId"],
      properties: {
        characterId: {
          type: "string",
          enum: ["pomo", "fynn", "olli", "nixi", "ember", "kipi"],
          description: "ID of the companion",
        },
      },
    },
  },
  {
    name: "kineticanvas_create_project",
    description: "Create a new portable .kineti project manifest.",
    inputSchema: {
      type: "object",
      required: ["title"],
      properties: {
        title: { type: "string", description: "Project title" },
        id: { type: "string", description: "Optional project ID" },
      },
    },
  },
  {
    name: "kineticanvas_add_scene",
    description: "Add an animation scene to a KinetiCanvas project.",
    inputSchema: {
      type: "object",
      required: ["project", "name"],
      properties: {
        project: { type: "object", description: "Existing project manifest" },
        name: { type: "string", description: "Scene name" },
        duration: { type: "number", description: "Duration in seconds (default: 5)" },
      },
    },
  },
  {
    name: "kineticanvas_add_task_cue",
    description: "Attach an app or task cue (analytics, browser, design, music, terminal, document) to a scene.",
    inputSchema: {
      type: "object",
      required: ["scene", "type", "start", "duration"],
      properties: {
        scene: { type: "object", description: "Existing scene object" },
        type: {
          type: "string",
          enum: ["analytics", "browser", "design", "document", "music", "notification", "terminal"],
        },
        start: { type: "number", description: "Start time in seconds" },
        duration: { type: "number", description: "Duration in seconds" },
        label: { type: "string", description: "Optional cue label" },
      },
    },
  },
];

export function handleToolCall(name, args) {
  switch (name) {
    case "kineticanvas_list_characters":
      return {
        characters: CHARACTERS.map((char) => ({
          id: char.id,
          name: char.name,
          title: char.title,
          role: char.role,
          species: char.species,
          archetype: char.archetype,
          powers: char.powers,
          workingStyle: char.workingStyle,
          signatureCue: char.signatureCue,
        })),
      };

    case "kineticanvas_get_character": {
      const char = getCharacterById(args.characterId);
      if (!char) throw new Error(`Character not found: ${args.characterId}`);
      return char;
    }

    case "kineticanvas_create_project": {
      return createProject({ id: args.id, title: args.title });
    }

    case "kineticanvas_add_scene": {
      const scene = createScene({ name: args.name, duration: args.duration || 5 });
      return addScene(args.project, scene);
    }

    case "kineticanvas_add_task_cue": {
      const cue = createTaskCue({
        type: args.type,
        start: args.start,
        duration: args.duration,
        label: args.label,
      });
      return addTaskCue(args.scene, cue);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export function startMcpServer() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

  rl.on("line", (line) => {
    if (!line.trim()) return;
    try {
      const msg = JSON.parse(line);
      const id = msg.id;

      if (msg.method === "initialize") {
        const response = {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            serverInfo: { name: "kineticanvas-mcp", version: "0.1.0" },
            capabilities: { tools: {} },
          },
        };
        process.stdout.write(JSON.stringify(response) + "\n");
      } else if (msg.method === "tools/list") {
        const response = {
          jsonrpc: "2.0",
          id,
          result: { tools: TOOLS },
        };
        process.stdout.write(JSON.stringify(response) + "\n");
      } else if (msg.method === "tools/call") {
        const { name, arguments: args } = msg.params || {};
        try {
          const result = handleToolCall(name, args || {});
          const response = {
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            },
          };
          process.stdout.write(JSON.stringify(response) + "\n");
        } catch (err) {
          const response = {
            jsonrpc: "2.0",
            id,
            error: { code: -32603, message: err.message },
          };
          process.stdout.write(JSON.stringify(response) + "\n");
        }
      } else {
        const response = {
          jsonrpc: "2.0",
          id,
          result: {},
        };
        process.stdout.write(JSON.stringify(response) + "\n");
      }
    } catch {
      // Ignore parse errors on malformed lines
    }
  });
}
