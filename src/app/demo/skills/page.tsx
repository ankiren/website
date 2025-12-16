import Link from "next/link";
import Card from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const userStories = [
  {
    id: "US-6.1",
    name: "Skill Management (Admin)",
    priority: "Critical",
    actor: "Admin",
    description: "As an administrator, I want to create, edit, and delete skills with hierarchical structure, so that users can track their proficiency for these skills.",
    href: "/demo/skills/us-6-1",
  },
  {
    id: "US-6.2",
    name: "View Available Skills",
    priority: "Critical",
    actor: "User",
    description: "As a user, I want to browse all available skills in the system, so that I can find skills I want to track.",
    href: "/demo/skills/us-6-2",
  },
  {
    id: "US-6.3",
    name: "Record Skill Score",
    priority: "Critical",
    actor: "User",
    description: "As a user, I want to record my proficiency score for a skill, so that I can track my current level.",
    href: "/demo/skills/us-6-3",
  },
  {
    id: "US-6.4",
    name: "View Score History",
    priority: "High",
    actor: "User",
    description: "As a user, I want to view my score history for a skill, so that I can see how my proficiency has changed over time.",
    href: "/demo/skills/us-6-4",
  },
  {
    id: "US-6.5",
    name: "My Skills Dashboard",
    priority: "High",
    actor: "User",
    description: "As a user, I want to see an overview of all my tracked skills, so that I can quickly assess my overall progress.",
    href: "/demo/skills/us-6-5",
  },
  {
    id: "US-6.6",
    name: "Progress Visualization",
    priority: "High",
    actor: "User",
    description: "As a user, I want to visualize my skill progress with charts, so that I can better understand my learning journey.",
    href: "/demo/skills/us-6-6",
  },
  {
    id: "US-6.7",
    name: "Skill Score Analytics",
    priority: "Medium",
    actor: "User",
    description: "As a user, I want to see analytics about my skill performance, so that I can identify strengths and areas for improvement.",
    href: "/demo/skills/us-6-7",
  },
  {
    id: "US-6.8",
    name: "Bulk Score Import",
    priority: "Low",
    actor: "User",
    description: "As a user, I want to import multiple scores from external sources, so that I can quickly update my skill records.",
    href: "/demo/skills/us-6-8",
  },
];

function getPriorityVariant(priority: string): "danger" | "warning" | "primary" | "default" {
  switch (priority) {
    case "Critical": return "danger";
    case "High": return "warning";
    case "Medium": return "primary";
    default: return "default";
  }
}

export default function SkillsDemoIndex() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Epic 6: Skill Management</h1>
              <p className="text-gray-500 mt-2">
                Enable skill tracking with score assessment, progress history, and admin-managed skill hierarchy.
              </p>
            </div>
            <Badge variant="warning">Demo</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">User Stories</h2>
          <p className="text-gray-600">Click on a user story to see its demo page.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userStories.map((story) => (
            <Link key={story.id} href={story.href}>
              <Card className={`h-full hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${
                story.actor === "Admin" ? "border-l-purple-500" : "border-l-blue-500"
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <Badge variant="primary">{story.id}</Badge>
                    <Badge variant={story.actor === "Admin" ? "warning" : "success"}>{story.actor}</Badge>
                  </div>
                  <Badge variant={getPriorityVariant(story.priority)}>{story.priority}</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{story.name}</h3>
                <p className="text-gray-600 text-sm">{story.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          Demo pages for Epic 6: Skill Management
        </div>
      </footer>
    </div>
  );
}
