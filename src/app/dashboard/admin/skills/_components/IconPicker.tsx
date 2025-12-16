"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { SkillIcon } from "./SkillIcon";
import { ICON_SEARCH_DATA } from "../_iconSearchData";

// Icon categories from lucide.dev
const ICON_CATEGORIES: Record<string, string[]> = {
  All: [],
  Accessibility: [
    "Accessibility", "Baby", "BadgeInfo", "BadgeQuestionMark", "CircleQuestionMark",
    "ClosedCaption", "Contrast", "Ear", "EarOff", "Eclipse", "Eye", "EyeClosed",
    "EyeOff", "Glasses", "Hand", "Info", "LifeBuoy", "Moon", "MoonStar",
    "PersonStanding", "ScanEye", "ScanSearch", "Speech", "Sun", "SunDim",
    "SunMedium", "SunMoon", "Transgender", "ZoomIn", "ZoomOut",
  ],
  "Accounts & access": [
    "Activity", "AtSign", "Award", "Badge", "BadgeAlert", "BadgeInfo", "Ban",
    "Bell", "BellDot", "BookUser", "Bookmark", "Building", "CircleUser", "Cog",
    "Contact", "CreditCard", "Flag", "Gift", "Handshake", "IdCard", "Inbox",
    "Key", "KeyRound", "Link", "LogIn", "LogOut", "Mail", "MapPin", "Menu",
    "Pin", "Settings", "Shield", "Star", "Tag", "ThumbsDown", "ThumbsUp",
    "User", "UserCheck", "UserMinus", "UserPlus", "Users", "Wallet",
  ],
  Animals: [
    "Bird", "Birdhouse", "Bone", "Bug", "Cat", "Dog", "Egg", "Fish", "Panda",
    "PawPrint", "Rabbit", "Rat", "Shell", "Snail", "Squirrel", "Turtle", "Worm",
  ],
  Arrows: [
    "ArrowBigDown", "ArrowBigLeft", "ArrowBigRight", "ArrowBigUp", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowUp", "ChevronDown", "ChevronLeft",
    "ChevronRight", "ChevronUp", "ChevronsDown", "ChevronsLeft", "ChevronsRight",
    "ChevronsUp", "CornerDownLeft", "CornerDownRight", "CornerUpLeft",
    "CornerUpRight", "MoveDown", "MoveLeft", "MoveRight", "MoveUp", "Redo",
    "RefreshCcw", "RefreshCw", "Repeat", "RotateCcw", "RotateCw", "Shuffle",
    "TrendingDown", "TrendingUp", "Undo",
  ],
  Brands: [
    "Airplay", "Bitcoin", "Chromium", "Codepen", "Codesandbox", "Dribbble",
    "Facebook", "Figma", "Framer", "Github", "Gitlab", "Instagram", "Linkedin",
    "Slack", "Trello", "Twitch", "Twitter", "Youtube",
  ],
  Buildings: [
    "Building", "Building2", "Castle", "Church", "Factory", "Hospital", "Hotel",
    "House", "Landmark", "School", "Store", "University", "Warehouse",
  ],
  Charts: [
    "ChartArea", "ChartBar", "ChartLine", "ChartPie", "TrendingDown",
    "TrendingUp",
  ],
  "Coding & development": [
    "Binary", "Blocks", "Book", "Braces", "Brackets", "Bug", "Code", "CodeXml",
    "Component", "Computer", "Database", "FileCode", "FolderCode", "GitBranch",
    "GitCommitHorizontal", "GitFork", "GitMerge", "GitPullRequest", "Github",
    "Keyboard", "Laptop", "Monitor", "Package", "Puzzle", "Regex", "Rocket",
    "Server", "Terminal", "Variable", "Webhook", "Wrench",
  ],
  Communication: [
    "Antenna", "Camera", "Contact", "Headphones", "Mail", "Mic", "Newspaper",
    "Phone", "PhoneCall", "Presentation", "Send", "Speech", "Tv", "Video",
    "Voicemail", "Volume", "Volume2", "Webcam",
  ],
  Design: [
    "Blend", "Brush", "Contrast", "Crop", "Dribbble", "Eye", "Figma", "Frame",
    "Grid2x2", "Highlighter", "Layers", "LayoutDashboard", "LayoutGrid",
    "Paintbrush", "Palette", "Pen", "Pencil", "PencilRuler", "Pipette",
    "Ruler", "Scissors", "Wand", "ZoomIn", "ZoomOut",
  ],
  Education: [
    "Book", "BookA", "BookOpen", "BookText", "Brain", "GraduationCap", "Languages",
    "Library", "Medal", "Notebook", "PenTool", "Pencil", "School", "University",
  ],
  "File icons": [
    "Archive", "Download", "File", "FileArchive", "FileCode", "FileImage",
    "FileMinus", "FileMusic", "FilePlus", "FileText", "FileVideo", "Files",
    "Folder", "FolderMinus", "FolderOpen", "FolderPlus", "FolderTree", "Folders",
    "Upload",
  ],
  Finance: [
    "Banknote", "Bitcoin", "Calculator", "CircleDollarSign", "CreditCard",
    "DollarSign", "Euro", "Landmark", "PiggyBank", "Receipt", "Wallet",
  ],
  "Food & beverage": [
    "Apple", "Banana", "Beer", "Cake", "Candy", "Carrot", "Cherry", "Coffee",
    "Cookie", "CookingPot", "Croissant", "Egg", "GlassWater", "Grape", "Ham",
    "IceCreamCone", "Milk", "Pizza", "Soup", "Utensils", "Wine",
  ],
  Gaming: [
    "Award", "Box", "Castle", "Crown", "Diamond", "Dice1", "Dice2", "Dice3",
    "Dice4", "Dice5", "Dice6", "Gamepad", "Gamepad2", "Ghost", "Gift", "Gem",
    "Joystick", "Medal", "Puzzle", "Shield", "Skull", "Star", "Sword", "Target",
    "Trophy",
  ],
  Home: [
    "Armchair", "Bed", "DoorClosed", "DoorOpen", "Fan", "Hammer", "House",
    "Lamp", "LampDesk", "Refrigerator", "Sofa", "Toilet", "WashingMachine",
  ],
  Mail: [
    "Archive", "Inbox", "Mail", "MailCheck", "MailMinus", "MailOpen", "MailPlus",
    "MailX", "Mailbox", "Mails", "Paperclip", "Reply", "ReplyAll", "Send",
    "Trash", "Trash2",
  ],
  Mathematics: [
    "Calculator", "Circle", "Divide", "Equal", "Hexagon", "Minus", "Octagon",
    "Pentagon", "Percent", "Pi", "Plus", "Square", "Triangle", "Variable",
  ],
  Medical: [
    "Activity", "Ambulance", "Bandage", "Bone", "Brain", "HeartPulse", "Hospital",
    "Pill", "Siren", "Stethoscope", "Syringe", "Thermometer",
  ],
  Multimedia: [
    "Album", "Camera", "Clapperboard", "Film", "Headphones", "Image", "Images",
    "Mic", "Music", "Music2", "Music3", "Music4", "Pause", "Play", "Radio",
    "Repeat", "Shuffle", "SkipBack", "SkipForward", "Speaker", "Tv", "Video",
    "Volume", "Volume2", "VolumeX", "Youtube",
  ],
  Nature: [
    "Cloud", "CloudRain", "CloudSnow", "CloudSun", "Flower", "Leaf", "Moon",
    "Mountain", "Rainbow", "Snowflake", "Sprout", "Sun", "Sunrise", "Sunset",
    "TreeDeciduous", "TreePine", "Trees", "Wind",
  ],
  Navigation: [
    "Compass", "Globe", "Map", "MapPin", "Navigation", "Radar", "Route",
    "Signpost",
  ],
  Notification: [
    "Bell", "BellDot", "BellMinus", "BellOff", "BellPlus", "BellRing", "Check",
    "CheckCheck", "CircleAlert", "CircleCheck", "CircleX", "Info", "TriangleAlert",
    "X",
  ],
  Science: [
    "Atom", "Beaker", "Brain", "FlaskConical", "FlaskRound", "Microscope",
    "Orbit", "Pipette", "Radiation", "Satellite", "Scale", "Stethoscope",
    "Telescope", "TestTube",
  ],
  Security: [
    "Eye", "EyeOff", "FileKey", "FolderKey", "Key", "KeyRound", "Lock",
    "LockKeyhole", "LockOpen", "Scan", "ScanFace", "Shield", "ShieldAlert",
    "ShieldCheck", "ShieldOff", "ShieldX", "UserLock",
  ],
  Shapes: [
    "Circle", "Diamond", "Heart", "Hexagon", "Octagon", "Pentagon", "Square",
    "Star", "Triangle",
  ],
  Social: [
    "Cake", "Facebook", "Flag", "Gift", "HandHeart", "Handshake", "Heart",
    "Instagram", "Linkedin", "MessageCircle", "MessageSquare", "PartyPopper",
    "Share", "Share2", "Star", "ThumbsDown", "ThumbsUp", "Twitter", "Users",
    "Youtube",
  ],
  Sports: [
    "Award", "Bike", "Dumbbell", "Medal", "Target", "Trophy", "Volleyball",
  ],
  "Text formatting": [
    "ALargeSmall", "Bold", "CaseLower", "CaseSensitive", "CaseUpper", "Heading",
    "Heading1", "Heading2", "Heading3", "Highlighter", "Italic", "List",
    "ListOrdered", "Pilcrow", "Quote", "Strikethrough", "Subscript", "Superscript",
    "Type", "Underline",
  ],
  "Time & calendar": [
    "AlarmClock", "Calendar", "CalendarCheck", "CalendarDays", "CalendarMinus",
    "CalendarPlus", "CalendarX", "Clock", "Clock1", "Clock2", "Clock3", "Clock4",
    "Clock5", "History", "Hourglass", "Timer", "Watch",
  ],
  Tools: [
    "Brush", "Drill", "Hammer", "Paintbrush", "Pen", "Pencil", "Ruler",
    "Scissors", "Shovel", "Wrench",
  ],
  Transportation: [
    "Anchor", "Bike", "Bus", "Car", "Plane", "PlaneLanding", "PlaneTakeoff",
    "Ship", "Train", "Truck",
  ],
  Travel: [
    "Backpack", "Compass", "Luggage", "Map", "MapPin", "Plane", "PlaneLanding",
    "PlaneTakeoff", "Tent", "Umbrella",
  ],
  Weather: [
    "Cloud", "CloudDrizzle", "CloudFog", "CloudHail", "CloudLightning", "CloudMoon",
    "CloudRain", "CloudSnow", "CloudSun", "Cloudy", "Droplet", "Moon", "Rainbow",
    "Snowflake", "Sun", "Sunrise", "Sunset", "Thermometer", "Tornado", "Umbrella",
    "Wind",
  ],
};

// Get all unique icons from categories
const ALL_ICONS = Object.values(ICON_CATEGORIES)
  .flat()
  .filter((v, i, a) => a.indexOf(v) === i)
  .sort();

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [iconsToShow, setIconsToShow] = useState(100);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Reset icons to show when search or category changes
  useEffect(() => {
    setIconsToShow(100);
  }, [search, category]);

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    let icons =
      category === "All" ? ALL_ICONS : ICON_CATEGORIES[category] || [];

    if (search) {
      const term = search.toLowerCase();
      icons = icons.filter((iconName) => {
        // Match icon name
        if (iconName.toLowerCase().includes(term)) return true;

        // Match tags and categories from search data
        const meta = ICON_SEARCH_DATA[iconName];
        if (meta) {
          if (meta.tags.some((tag) => tag.toLowerCase().includes(term)))
            return true;
          if (meta.categories.some((cat) => cat.toLowerCase().includes(term)))
            return true;
        }
        return false;
      });
    }

    return icons;
  }, [search, category]);

  const visibleIcons = filteredIcons.slice(0, iconsToShow);
  const hasMore = filteredIcons.length > iconsToShow;

  const categories = Object.keys(ICON_CATEGORIES);

  return (
    <div className="space-y-3">
      {/* Selected icon preview */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
          <SkillIcon name={value} className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Selected icon</p>
          <p className="font-medium text-gray-800">{value}</p>
        </div>
      </div>

      {/* Search and category filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {category}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                categoryDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {categoryDropdownOpen && (
            <div className="absolute right-0 z-50 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setCategoryDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                      category === cat
                        ? "bg-violet-50 text-violet-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Icon grid */}
      <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-2">
        {visibleIcons.length > 0 ? (
          <>
            <div className="grid grid-cols-8 gap-1">
              {visibleIcons.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => onChange(iconName)}
                  className={`p-2 rounded-lg transition-all ${
                    value === iconName
                      ? "bg-violet-500 text-white"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  title={iconName}
                >
                  <SkillIcon name={iconName} className="w-5 h-5" strokeWidth={1.5} />
                </button>
              ))}
            </div>
            {hasMore && (
              <button
                type="button"
                onClick={() => setIconsToShow((prev) => prev + 100)}
                className="w-full mt-2 py-2 text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                Load more ({filteredIcons.length - iconsToShow} remaining)
              </button>
            )}
          </>
        ) : (
          <p className="text-center py-8 text-gray-400 text-sm">
            No icons found
          </p>
        )}
      </div>

      <p className="text-xs text-gray-400">
        {filteredIcons.length} icons available
      </p>
    </div>
  );
}
