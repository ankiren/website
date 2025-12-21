"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Sparkles, Target, TrendingUp, Star, ChevronDown, Check, Trophy, BookOpen, Filter, LayoutGrid, List, Edit2, Trash2, MoreHorizontal } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { DemoHeader, SkillIcon, getScoreLevel, RadarChart } from "../../_shared";
import { getBillGatesSkills, getBillGatesLifeAspects, UserCustomSkill } from "../../_buffettSkills";

const PERSON_AGE = 10;
const PAGE_TITLE = "Bill Gates Age 10 (1965)";
const PAGE_DESC = "A precocious child obsessed with reading and learning";
const THEME_COLOR = "blue";

const SKILL_COLORS = [
  { name: "Violet", gradient: "from-violet-500 to-purple-600" },
  { name: "Blue", gradient: "from-blue-500 to-cyan-500" },
  { name: "Emerald", gradient: "from-emerald-500 to-teal-500" },
  { name: "Orange", gradient: "from-orange-500 to-amber-500" },
  { name: "Pink", gradient: "from-pink-500 to-rose-500" },
  { name: "Indigo", gradient: "from-indigo-500 to-blue-600" },
  { name: "Cyan", gradient: "from-cyan-500 to-blue-500" },
  { name: "Rose", gradient: "from-rose-500 to-pink-600" },
  { name: "Amber", gradient: "from-amber-500 to-yellow-500" },
  { name: "Teal", gradient: "from-teal-500 to-emerald-500" },
];

const POPULAR_ICONS = ["BookOpen", "Code", "Calculator", "Brain", "Target", "Trophy", "Star", "Lightbulb", "Heart", "Globe", "Rocket", "Briefcase", "GraduationCap", "PenTool", "Mic", "Video"];

const initialUserSkills = getBillGatesSkills(PERSON_AGE);
const lifeAspects = getBillGatesLifeAspects(PERSON_AGE);

function SkillCard({ skill, onEdit, onDelete }: { skill: UserCustomSkill; onEdit: (s: UserCustomSkill) => void; onDelete: (id: number) => void }) {
  const [showMenu, setShowMenu] = useState(false);
  const color = SKILL_COLORS[skill.color] || SKILL_COLORS[0];
  const level = getScoreLevel(skill.currentScore);
  const progress = (skill.currentScore / skill.targetScore) * 100;

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className={`h-24 bg-gradient-to-br ${color.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center`}><SkillIcon name={skill.icon} className="w-6 h-6 text-white" /></div>
        </div>
        <div className="absolute top-3 right-3">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30"><MoreHorizontal className="w-4 h-4 text-white" /></button>
          {showMenu && <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border py-1 min-w-[120px] z-10">
            <button onClick={() => { onEdit(skill); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Edit2 className="w-4 h-4" /> Edit</button>
            <button onClick={() => { onDelete(skill.id); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
          </div>}
        </div>
      </div>
      <div className="pt-12 pb-5 px-5">
        <h3 className="text-lg font-bold text-gray-900 text-center mb-1">{skill.name}</h3>
        <p className="text-sm text-gray-500 text-center mb-4 line-clamp-2">{skill.description}</p>
        <div className="flex items-center justify-between mb-3">
          <div><span className="text-3xl font-bold text-gray-900">{skill.currentScore}</span><span className="text-gray-400 text-sm">/{skill.targetScore}</span></div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${level.variant === 'primary' ? 'bg-purple-100 text-purple-700' : level.variant === 'success' ? 'bg-green-100 text-green-700' : level.variant === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{level.level}</span>
        </div>
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-4"><div className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color.gradient} rounded-full`} style={{ width: `${Math.min(progress, 100)}%` }} /></div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-gray-50 rounded-xl p-2.5"><p className="text-lg font-bold text-gray-900">{skill.totalPractices.toLocaleString()}</p><p className="text-xs text-gray-500">Practices</p></div>
          <div className="bg-gray-50 rounded-xl p-2.5"><p className="text-lg font-bold text-gray-900">{Math.round(progress)}%</p><p className="text-xs text-gray-500">To Goal</p></div>
        </div>
      </div>
    </div>
  );
}

function AddSkillModal({ isOpen, onClose, onAdd, editSkill }: { isOpen: boolean; onClose: () => void; onAdd: (s: Omit<UserCustomSkill, 'id' | 'createdAt' | 'lastPracticed' | 'totalPractices'>) => void; editSkill?: UserCustomSkill | null }) {
  const [name, setName] = useState(""); const [description, setDescription] = useState(""); const [icon, setIcon] = useState("Star"); const [color, setColor] = useState(0);
  const [currentScore, setCurrentScore] = useState(0); const [targetScore, setTargetScore] = useState(100); const [showIconPicker, setShowIconPicker] = useState(false); const [iconSearch, setIconSearch] = useState(""); const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (isOpen) { if (editSkill) { setName(editSkill.name); setDescription(editSkill.description); setIcon(editSkill.icon); setColor(editSkill.color); setCurrentScore(editSkill.currentScore); setTargetScore(editSkill.targetScore); } else { setName(""); setDescription(""); setIcon("Star"); setColor(0); setCurrentScore(0); setTargetScore(100); } setErrors({}); setShowIconPicker(false); setIconSearch(""); } }, [isOpen, editSkill]);

  const filteredIcons = useMemo(() => iconSearch ? POPULAR_ICONS.filter(i => i.toLowerCase().includes(iconSearch.toLowerCase())) : POPULAR_ICONS, [iconSearch]);
  const validate = () => { const e: Record<string, string> = {}; if (!name.trim()) e.name = "Required"; if (currentScore > targetScore) e.currentScore = "Exceeds target"; setErrors(e); return !Object.keys(e).length; };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!validate()) return; onAdd({ name: name.trim(), description: description.trim(), icon, color, currentScore, targetScore }); onClose(); };
  const selectedColor = SKILL_COLORS[color];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editSkill ? "Edit Skill" : "Add New Skill"} size="lg">
      <div className={`-mx-6 -mt-4 mb-6 px-6 py-6 bg-gradient-to-br ${selectedColor.gradient} relative overflow-hidden`}>
        <div className="flex items-center gap-4"><div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center"><div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedColor.gradient} flex items-center justify-center`}><SkillIcon name={icon} className="w-5 h-5 text-white" /></div></div><div><p className="text-white font-bold text-lg">{name || "Your Skill"}</p><p className="text-white/70 text-sm">Preview</p></div></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Skill Name *" value={name} onChange={e => setName(e.target.value)} error={errors.name} />
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
          <button type="button" onClick={() => setShowIconPicker(!showIconPicker)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3"><div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedColor.gradient} flex items-center justify-center`}><SkillIcon name={icon} className="w-5 h-5 text-white" /></div><span className="flex-1">{icon}</span><ChevronDown className="w-5 h-5 text-gray-400" /></button>
          {showIconPicker && <div className="mt-2 p-3 bg-gray-50 rounded-xl border"><div className="relative mb-3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={iconSearch} onChange={e => setIconSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm" /></div><div className="grid grid-cols-8 gap-1 max-h-36 overflow-y-auto">{filteredIcons.map(n => <button key={n} type="button" onClick={() => { setIcon(n); setShowIconPicker(false); }} className={`p-2 rounded-lg ${icon === n ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}><SkillIcon name={n} className="w-5 h-5" /></button>)}</div></div>}
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Color</label><div className="grid grid-cols-5 gap-2">{SKILL_COLORS.map((c, i) => <button key={i} type="button" onClick={() => setColor(i)} className={`h-10 rounded-xl bg-gradient-to-br ${c.gradient} ${color === i ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}>{color === i && <Check className="w-5 h-5 text-white mx-auto" />}</button>)}</div></div>
        <div className="grid grid-cols-2 gap-4"><Input label="Current Score" type="number" value={currentScore} onChange={e => setCurrentScore(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))} error={errors.currentScore} /><Input label="Target Score" type="number" value={targetScore} onChange={e => setTargetScore(Math.max(1, Math.min(100, parseInt(e.target.value) || 100)))} /></div>
        <div className="flex justify-end gap-3 pt-4 border-t"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">{editSkill ? <><Check className="w-4 h-4" /> Save</> : <><Sparkles className="w-4 h-4" /> Create</>}</Button></div>
      </form>
    </Modal>
  );
}

export default function Page() {
  const [skills, setSkills] = useState<UserCustomSkill[]>(initialUserSkills);
  const [showAddModal, setShowAddModal] = useState(false); const [editingSkill, setEditingSkill] = useState<UserCustomSkill | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); const [sortBy, setSortBy] = useState<"name" | "score" | "recent">("recent"); const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filteredSkills = useMemo(() => { let r = skills.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())); if (sortBy === "name") r.sort((a, b) => a.name.localeCompare(b.name)); else if (sortBy === "score") r.sort((a, b) => b.currentScore - a.currentScore); else r.sort((a, b) => new Date(b.lastPracticed).getTime() - new Date(a.lastPracticed).getTime()); return r; }, [skills, searchQuery, sortBy]);
  const stats = useMemo(() => ({ total: skills.length, avg: skills.length ? Math.round(skills.reduce((s, x) => s + x.currentScore, 0) / skills.length) : 0, practices: skills.reduce((s, x) => s + x.totalPractices, 0), max: skills.length ? Math.max(...skills.map(s => s.currentScore)) : 0 }), [skills]);
  const handleAdd = (d: Omit<UserCustomSkill, 'id' | 'createdAt' | 'lastPracticed' | 'totalPractices'>) => { if (editingSkill) { setSkills(p => p.map(s => s.id === editingSkill.id ? { ...s, ...d } : s)); setEditingSkill(null); } else setSkills(p => [{ ...d, id: Date.now(), createdAt: new Date().toISOString().split('T')[0], lastPracticed: new Date().toISOString().split('T')[0], totalPractices: 0 }, ...p]); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <DemoHeader title={PAGE_TITLE} storyId="US-6-2" description={PAGE_DESC} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-3xl p-8 mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-start justify-between mb-6"><div><h2 className="text-3xl font-bold text-white mb-2">{PAGE_TITLE}</h2><p className="text-blue-100">{PAGE_DESC}</p></div><button onClick={() => { setEditingSkill(null); setShowAddModal(true); }} className="px-5 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"><Plus className="w-5 h-5" />Add</button></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Target className="w-5 h-5 text-white" /></div><span className="text-white/80 text-sm">Total</span></div><p className="text-3xl font-bold text-white">{stats.total}</p></div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><TrendingUp className="w-5 h-5 text-white" /></div><span className="text-white/80 text-sm">Avg</span></div><p className="text-3xl font-bold text-white">{stats.avg}</p></div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Star className="w-5 h-5 text-white" /></div><span className="text-white/80 text-sm">Practices</span></div><p className="text-3xl font-bold text-white">{stats.practices.toLocaleString()}</p></div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Trophy className="w-5 h-5 text-white" /></div><span className="text-white/80 text-sm">Top</span></div><p className="text-3xl font-bold text-white">{stats.max}</p></div>
            </div>
          </div>
        </div>
        {/* Life Aspects Radar Chart */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <RadarChart data={lifeAspects.aspects} size={320} color={THEME_COLOR} />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Life Balance at Age {PERSON_AGE}</h3>
              <p className="text-gray-600 mb-6">{lifeAspects.summary}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {lifeAspects.aspects.map((aspect, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <SkillIcon name={aspect.icon} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{aspect.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: `${aspect.value}%` }} />
                      </div>
                      <span className="text-sm font-bold text-blue-600">{aspect.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm" /></div>
          <div className="relative"><button onClick={() => setShowSortDropdown(!showSortDropdown)} className="px-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center gap-2 shadow-sm"><Filter className="w-5 h-5" />Sort: {sortBy}<ChevronDown className="w-4 h-4" /></button>{showSortDropdown && <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border py-1 min-w-[140px] z-10">{['recent', 'name', 'score'].map(v => <button key={v} onClick={() => { setSortBy(v as typeof sortBy); setShowSortDropdown(false); }} className={`w-full px-4 py-2 text-left text-sm ${sortBy === v ? 'text-blue-600 bg-blue-50' : ''}`}>{v}</button>)}</div>}</div>
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm"><button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}><LayoutGrid className="w-5 h-5" /></button><button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}><List className="w-5 h-5" /></button></div>
        </div>
        {filteredSkills.length > 0 ? <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>{filteredSkills.map(skill => viewMode === 'grid' ? <SkillCard key={skill.id} skill={skill} onEdit={s => { setEditingSkill(s); setShowAddModal(true); }} onDelete={id => confirm("Delete?") && setSkills(p => p.filter(s => s.id !== id))} /> : <div key={skill.id} className="bg-white rounded-2xl shadow-lg border p-5 flex items-center gap-5"><div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${SKILL_COLORS[skill.color]?.gradient} flex items-center justify-center`}><SkillIcon name={skill.icon} className="w-8 h-8 text-white" /></div><div className="flex-1"><h3 className="text-lg font-bold">{skill.name}</h3><p className="text-sm text-gray-500 truncate">{skill.description}</p></div><div className="text-right"><p className="text-2xl font-bold">{skill.currentScore}</p><p className="text-sm text-gray-500">/{skill.targetScore}</p></div><div className="flex gap-2"><button onClick={() => { setEditingSkill(skill); setShowAddModal(true); }} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-5 h-5 text-gray-500" /></button><button onClick={() => confirm("Delete?") && setSkills(p => p.filter(s => s.id !== skill.id))} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-5 h-5 text-gray-500" /></button></div></div>)}</div> : <div className="text-center py-16"><BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-bold text-gray-900 mb-2">No skills found</h3></div>}
      </main>
      <AddSkillModal isOpen={showAddModal} onClose={() => { setShowAddModal(false); setEditingSkill(null); }} onAdd={handleAdd} editSkill={editingSkill} />
    </div>
  );
}
