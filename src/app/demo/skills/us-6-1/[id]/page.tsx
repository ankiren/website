"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skill, mockSkills, SkillIcon, flattenSkills } from "../../_shared";

const COLORS = [
  { from: "from-violet-500", to: "to-purple-500", bg: "bg-violet-500", light: "bg-violet-100", text: "text-violet-600", gradient: "bg-gradient-to-br from-violet-500 to-purple-500", ring: "ring-violet-500" },
  { from: "from-blue-500", to: "to-cyan-500", bg: "bg-blue-500", light: "bg-blue-100", text: "text-blue-600", gradient: "bg-gradient-to-br from-blue-500 to-cyan-500", ring: "ring-blue-500" },
  { from: "from-emerald-500", to: "to-teal-500", bg: "bg-emerald-500", light: "bg-emerald-100", text: "text-emerald-600", gradient: "bg-gradient-to-br from-emerald-500 to-teal-500", ring: "ring-emerald-500" },
  { from: "from-orange-500", to: "to-amber-500", bg: "bg-orange-500", light: "bg-orange-100", text: "text-orange-600", gradient: "bg-gradient-to-br from-orange-500 to-amber-500", ring: "ring-orange-500" },
  { from: "from-pink-500", to: "to-rose-500", bg: "bg-pink-500", light: "bg-pink-100", text: "text-pink-600", gradient: "bg-gradient-to-br from-pink-500 to-rose-500", ring: "ring-pink-500" },
  { from: "from-indigo-500", to: "to-blue-500", bg: "bg-indigo-500", light: "bg-indigo-100", text: "text-indigo-600", gradient: "bg-gradient-to-br from-indigo-500 to-blue-500", ring: "ring-indigo-500" },
];

const SKILL_COLORS = [
  { name: "Violet", class: "bg-violet-500" },
  { name: "Blue", class: "bg-blue-500" },
  { name: "Emerald", class: "bg-emerald-500" },
  { name: "Orange", class: "bg-orange-500" },
  { name: "Pink", class: "bg-pink-500" },
  { name: "Indigo", class: "bg-indigo-500" },
  { name: "Cyan", class: "bg-cyan-500" },
  { name: "Rose", class: "bg-rose-500" },
  { name: "Amber", class: "bg-amber-500" },
  { name: "Teal", class: "bg-teal-500" },
];

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = Number(params.id);

  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [mounted, setMounted] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIcon, setEditIcon] = useState("FileText");
  const [editColor, setEditColor] = useState(0);

  useEffect(() => setMounted(true), []);

  const allSkills = flattenSkills(skills);
  const skill = allSkills.find(s => s.id === skillId);
  const parentSkill = skill?.parentId ? allSkills.find(s => s.id === skill.parentId) : null;

  // Build breadcrumb path
  const buildBreadcrumb = (s: Skill | null): Skill[] => {
    if (!s) return [];
    const parent = s.parentId ? allSkills.find(p => p.id === s.parentId) : null;
    return [...buildBreadcrumb(parent || null), s];
  };
  const breadcrumb = skill ? buildBreadcrumb(skill) : [];

  // Count total descendants
  const countDescendants = (s: Skill): number => {
    if (!s.children) return 0;
    return s.children.reduce((acc, child) => acc + 1 + countDescendants(child), 0);
  };

  const getSkillColor = (s: Skill) => {
    if (s.color !== undefined) return COLORS[s.color % COLORS.length];
    const findRootIndex = (targetId: number, list: Skill[]): number => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === targetId) return i;
        const found = findInChildren(targetId, list[i].children);
        if (found) return i;
      }
      return 0;
    };
    const findInChildren = (targetId: number, children?: Skill[]): boolean => {
      if (!children) return false;
      return children.some(c => c.id === targetId || findInChildren(targetId, c.children));
    };
    return COLORS[findRootIndex(s.id, skills) % COLORS.length];
  };

  const color = skill ? getSkillColor(skill) : COLORS[0];

  const openEditModal = () => {
    if (!skill) return;
    setEditName(skill.name);
    setEditDescription(skill.description || "");
    setEditIcon(skill.icon || "FileText");
    setEditColor(skill.color !== undefined ? skill.color : 0);
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (!skill) return;
    const updateSkill = (list: Skill[]): Skill[] =>
      list.map(s => {
        if (s.id === skill.id) {
          return { ...s, name: editName, description: editDescription, icon: editIcon, color: editColor };
        }
        if (s.children) {
          return { ...s, children: updateSkill(s.children) };
        }
        return s;
      });
    setSkills(updateSkill(skills));
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (!skill) return;
    const removeSkill = (list: Skill[]): Skill[] =>
      list.filter(s => s.id !== skill.id).map(s => ({
        ...s,
        children: s.children ? removeSkill(s.children) : undefined,
      }));
    setSkills(removeSkill(skills));
    setIsDeleteModalOpen(false);
    router.push("/demo/skills/us-6-1");
  };

  if (!skill) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center animate-pulse">
            <svg className="w-16 h-16 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Skill Not Found</h3>
          <p className="text-white/60 font-medium mb-8">The skill you&apos;re looking for doesn&apos;t exist</p>
          <button
            onClick={() => router.push("/demo/skills/us-6-1")}
            className="px-8 py-4 bg-white text-purple-600 font-bold rounded-2xl transition-all hover:scale-105 hover:shadow-2xl"
          >
            Back to Skills
          </button>
        </div>
      </div>
    );
  }

  const totalDescendants = countDescendants(skill);
  const depth = breadcrumb.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full ${color.gradient} opacity-10 blur-3xl`} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-pink-500 to-rose-500 opacity-5 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Compact Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push("/demo/skills/us-6-1")}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                {/* Breadcrumb */}
                <nav className="hidden sm:flex items-center gap-1 text-sm">
                  <button
                    onClick={() => router.push("/demo/skills/us-6-1")}
                    className="text-gray-500 hover:text-gray-900 transition-colors font-medium"
                  >
                    Skills
                  </button>
                  {breadcrumb.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      {idx === breadcrumb.length - 1 ? (
                        <span className="font-bold text-gray-900">{item.name}</span>
                      ) : (
                        <button
                          onClick={() => router.push(`/demo/skills/us-6-1/${item.id}`)}
                          className="text-gray-500 hover:text-gray-900 transition-colors font-medium"
                        >
                          {item.name}
                        </button>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="primary">US-6.1</Badge>
                <Badge variant="warning">Demo</Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Hero Section */}
          <div className={`relative rounded-[2rem] overflow-hidden mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Gradient Background */}
            <div className={`absolute inset-0 ${color.gradient}`} />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-60" />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />

            <div className="relative p-8 sm:p-12">
              <div className="flex flex-col sm:flex-row items-start gap-8">
                {/* Icon with Glow Effect */}
                <div className="relative group">
                  <div className="absolute inset-0 rounded-3xl bg-white/30 blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
                    <SkillIcon name={skill.icon} className="w-14 h-14 sm:w-18 sm:h-18 text-white drop-shadow-lg" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-white">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {parentSkill ? (
                      <button
                        onClick={() => router.push(`/demo/skills/us-6-1/${parentSkill.id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs font-semibold transition-all backdrop-blur-sm"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        {parentSkill.name}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Root Skill
                      </span>
                    )}
                  </div>

                  <h1 className="text-4xl sm:text-5xl font-black mb-4 drop-shadow-lg">{skill.name}</h1>

                  {skill.description && (
                    <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed mb-6">
                      {skill.description}
                    </p>
                  )}

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                      </svg>
                      <span className="font-bold">{skill.children?.length || 0}</span>
                      <span className="text-white/70">direct sub-skills</span>
                    </div>
                    {totalDescendants > 0 && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="font-bold">{totalDescendants}</span>
                        <span className="text-white/70">total in tree</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                      </svg>
                      <span className="font-bold">Level {depth}</span>
                      <span className="text-white/70">depth</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sub-skills Section */}
              {skill.children && skill.children.length > 0 && (
                <div className={`bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${color.gradient} flex items-center justify-center`}>
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                        </svg>
                      </div>
                      Sub-skills
                      <span className={`ml-auto px-3 py-1 rounded-full text-sm font-bold ${color.light} ${color.text}`}>
                        {skill.children.length}
                      </span>
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {skill.children.map((child, idx) => {
                        const childColor = getSkillColor(child);
                        return (
                          <button
                            key={child.id}
                            onClick={() => router.push(`/demo/skills/us-6-1/${child.id}`)}
                            className={`group relative p-4 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-transparent hover:shadow-xl ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                            style={{ transitionDelay: `${150 + idx * 50}ms` }}
                          >
                            {/* Hover gradient overlay */}
                            <div className={`absolute inset-0 rounded-2xl ${childColor.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            <div className="relative flex items-center gap-4">
                              <div className={`w-14 h-14 rounded-2xl ${childColor.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                                <SkillIcon name={child.icon} className="w-7 h-7 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 group-hover:text-white transition-colors">{child.name}</p>
                                {child.description && (
                                  <p className="text-sm text-gray-500 group-hover:text-white/80 truncate transition-colors">{child.description}</p>
                                )}
                                {child.children && child.children.length > 0 && (
                                  <div className="flex items-center gap-1.5 mt-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${childColor.bg} group-hover:bg-white/70 transition-colors`} />
                                    <span className={`text-xs font-semibold ${childColor.text} group-hover:text-white/80 transition-colors`}>
                                      {child.children.length} sub-skills
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-white/20 transition-all">
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State for no sub-skills */}
              {(!skill.children || skill.children.length === 0) && (
                <div className={`bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-12 text-center transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${color.gradient} flex items-center justify-center opacity-50`}>
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Sub-skills Yet</h3>
                  <p className="text-gray-500">This is a leaf skill with no children</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Card */}
              <div className={`bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Actions</h2>
                </div>
                <div className="p-4 space-y-3">
                  <button
                    onClick={openEditModal}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl ${color.gradient} text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </div>
                    <span>Edit Skill</span>
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </div>
                    <span>Delete Skill</span>
                  </button>
                </div>
              </div>

              {/* Skill Path Card */}
              {breadcrumb.length > 1 && (
                <div className={`bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Skill Path</h2>
                  </div>
                  <div className="p-4">
                    <div className="relative">
                      {breadcrumb.map((item, idx) => {
                        const itemColor = getSkillColor(item);
                        const isLast = idx === breadcrumb.length - 1;
                        return (
                          <div key={item.id} className="relative">
                            {idx > 0 && (
                              <div className="absolute left-5 -top-4 w-0.5 h-4 bg-gray-200" />
                            )}
                            <button
                              onClick={() => !isLast && router.push(`/demo/skills/us-6-1/${item.id}`)}
                              disabled={isLast}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                                isLast
                                  ? `${itemColor.light} ${itemColor.text} ring-2 ${itemColor.ring}`
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-xl ${itemColor.gradient} flex items-center justify-center shadow`}>
                                <SkillIcon name={item.icon} className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 text-left">
                                <p className={`font-semibold ${isLast ? itemColor.text : "text-gray-700"}`}>{item.name}</p>
                                <p className="text-xs text-gray-400">Level {idx + 1}</p>
                              </div>
                              {isLast && (
                                <span className="text-xs font-bold px-2 py-1 bg-white rounded-lg">Current</span>
                              )}
                            </button>
                            {idx < breadcrumb.length - 1 && (
                              <div className="h-4" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Skill" size="md">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Skill Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_COLORS.map((c, idx) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setEditColor(idx)}
                  className={`w-8 h-8 rounded-full ${c.class} transition-all duration-200 ${editColor === idx ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-110"}`}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleUpdate}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/30"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Skill" size="sm">
        <div className="space-y-5 text-center">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete {skill.name}?</h3>
            <p className="text-gray-500">This action cannot be undone.</p>
          </div>
          {skill.children && skill.children.length > 0 && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <p className="text-amber-800 text-sm font-medium">
                This will also delete <span className="font-bold">{totalDescendants}</span> sub-skill(s)
              </p>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
            >
              Delete
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
