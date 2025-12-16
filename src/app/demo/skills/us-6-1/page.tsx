"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { DemoHeader, Skill, mockSkills, AcceptanceCriteriaSection, SkillIcon } from "../_shared";
import { ICON_SEARCH_DATA } from "../_iconSearchData";

const COLORS = [
  { from: "from-violet-500", to: "to-purple-500", bg: "bg-violet-500", light: "bg-violet-100", text: "text-violet-600", gradient: "bg-gradient-to-br from-violet-500 to-purple-500" },
  { from: "from-blue-500", to: "to-cyan-500", bg: "bg-blue-500", light: "bg-blue-100", text: "text-blue-600", gradient: "bg-gradient-to-br from-blue-500 to-cyan-500" },
  { from: "from-emerald-500", to: "to-teal-500", bg: "bg-emerald-500", light: "bg-emerald-100", text: "text-emerald-600", gradient: "bg-gradient-to-br from-emerald-500 to-teal-500" },
  { from: "from-orange-500", to: "to-amber-500", bg: "bg-orange-500", light: "bg-orange-100", text: "text-orange-600", gradient: "bg-gradient-to-br from-orange-500 to-amber-500" },
  { from: "from-pink-500", to: "to-rose-500", bg: "bg-pink-500", light: "bg-pink-100", text: "text-pink-600", gradient: "bg-gradient-to-br from-pink-500 to-rose-500" },
  { from: "from-indigo-500", to: "to-blue-500", bg: "bg-indigo-500", light: "bg-indigo-100", text: "text-indigo-600", gradient: "bg-gradient-to-br from-indigo-500 to-blue-500" },
];

export default function US61AdminSkillManagement() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "tree">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIcon, setEditIcon] = useState("FileText");
  const [editColor, setEditColor] = useState(0);
  const [editParentId, setEditParentId] = useState<number | null>(null);
  const [editIconSearch, setEditIconSearch] = useState("");
  const [editIconCategory, setEditIconCategory] = useState("All");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillParentId, setNewSkillParentId] = useState<number | null>(null);
  const [newSkillDescription, setNewSkillDescription] = useState("");
  const [newSkillIcon, setNewSkillIcon] = useState("FileText");
  const [newSkillColor, setNewSkillColor] = useState(0);
  const [iconSearch, setIconSearch] = useState("");
  const [iconCategory, setIconCategory] = useState("All");
  const [parentDropdownOpen, setParentDropdownOpen] = useState(false);
  const [parentSearch, setParentSearch] = useState("");
  const [editParentDropdownOpen, setEditParentDropdownOpen] = useState(false);
  const [editParentSearch, setEditParentSearch] = useState("");
  const [iconsToShow, setIconsToShow] = useState(100);
  const [editIconsToShow, setEditIconsToShow] = useState(100);

  useEffect(() => setMounted(true), []);
  useEffect(() => setIconsToShow(100), [iconSearch, iconCategory]);
  useEffect(() => setEditIconsToShow(100), [editIconSearch, editIconCategory]);

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

  // Icon categories from lucide.dev (auto-generated from official repository - 1665 icons, 43 categories)
  const ICON_CATEGORIES: Record<string, string[]> = {
    "All": [],
    "Accessibility": [
      "Accessibility", "Baby", "BadgeInfo", "BadgeQuestionMark", "CircleQuestionMark", "ClosedCaption", "Contrast", "Ear", "EarOff", "Eclipse",
      "Eye", "EyeClosed", "EyeOff", "Glasses", "Hand", "Info", "LifeBuoy", "Moon", "MoonStar", "PersonStanding", "ScanEye", "ScanSearch",
      "Speech", "Sun", "SunDim", "SunMedium", "SunMoon", "Transgender", "ZoomIn", "ZoomOut",
    ],
    "Accounts & access": [
      "Activity", "AtSign", "Award", "Badge", "BadgeAlert", "BadgeInfo", "Ban", "Bell", "BellDot", "BookUser", "Bookmark", "BookmarkCheck",
      "BookmarkMinus", "BookmarkPlus", "BookmarkX", "Building", "Building2", "Cake", "CircleUser", "CircleUserRound", "Cog", "Contact",
      "ContactRound", "Cookie", "CreditCard", "FileUser", "FingerprintPattern", "Flag", "FlagOff", "Frown", "Gift", "HandCoins", "Handshake",
      "HatGlasses", "HeartHandshake", "HeartMinus", "HeartPlus", "IdCard", "IdCardLanyard", "Inbox", "Key", "KeyRound", "KeySquare", "Link",
      "Link2", "LogIn", "LogOut", "Mail", "MapPin", "MapPinCheck", "MapPinCheckInside", "MapPinHouse", "MapPinMinus", "MapPinMinusInside",
      "MapPinPen", "MapPinPlus", "MapPinPlusInside", "MapPinX", "MapPinXInside", "MapPinned", "Menu", "MessageCircleX", "NotebookTabs", "Pin",
      "RotateCcwKey", "ScanEye", "ScanFace", "ScanQrCode", "Settings", "Settings2", "Share", "Share2", "Shield", "ShieldAlert", "ShieldBan",
      "ShieldCheck", "ShieldEllipsis", "ShieldHalf", "ShieldMinus", "ShieldOff", "ShieldPlus", "ShieldQuestionMark", "ShieldUser", "ShieldX",
      "Slack", "SlidersHorizontal", "SlidersVertical", "Smile", "SquareUser", "SquareUserRound", "Star", "Tag", "Tags", "ThumbsDown", "ThumbsUp",
      "Ticket", "Tickets", "ToggleLeft", "ToggleRight", "Trello", "Twitch", "Twitter", "User", "UserCheck", "UserCog", "UserLock", "UserMinus",
      "UserPen", "UserPlus", "UserRound", "UserRoundCheck", "UserRoundCog", "UserRoundMinus", "UserRoundPen", "UserRoundPlus", "UserRoundSearch",
      "UserRoundX", "UserSearch", "UserStar", "UserX", "Users", "UsersRound", "VenetianMask", "Vibrate", "VibrateOff", "Wallet", "WalletCards",
      "WalletMinimal", "Wallpaper", "Waypoints", "Webhook", "WebhookOff", "Wrench",
    ],
    "Animals": [
      "Bird", "Birdhouse", "Bone", "Bug", "BugOff", "BugPlay", "Cat", "Dog", "Egg", "Fish", "FishOff", "FishSymbol", "Origami", "Panda",
      "PawPrint", "Rabbit", "Rat", "Shell", "Shrimp", "Snail", "Squirrel", "Turtle", "Worm",
    ],
    "Arrows": [
      "ArrowBigDown", "ArrowBigDownDash", "ArrowBigLeft", "ArrowBigLeftDash", "ArrowBigRight", "ArrowBigRightDash", "ArrowBigUp",
      "ArrowBigUpDash", "ArrowDown", "ArrowDown01", "ArrowDown10", "ArrowDownAZ", "ArrowDownFromLine", "ArrowDownLeft", "ArrowDownNarrowWide",
      "ArrowDownRight", "ArrowDownToDot", "ArrowDownToLine", "ArrowDownUp", "ArrowDownWideNarrow", "ArrowDownZA", "ArrowLeft",
      "ArrowLeftFromLine", "ArrowLeftRight", "ArrowLeftToLine", "ArrowRight", "ArrowRightFromLine", "ArrowRightLeft", "ArrowRightToLine",
      "ArrowUp", "ArrowUp01", "ArrowUp10", "ArrowUpAZ", "ArrowUpDown", "ArrowUpFromDot", "ArrowUpFromLine", "ArrowUpLeft", "ArrowUpNarrowWide",
      "ArrowUpRight", "ArrowUpToLine", "ArrowUpWideNarrow", "ArrowUpZA", "ArrowsUpFromLine", "CalendarSync", "ChevronDown", "ChevronFirst",
      "ChevronLast", "ChevronLeft", "ChevronRight", "ChevronUp", "ChevronsDown", "ChevronsDownUp", "ChevronsLeft", "ChevronsLeftRight",
      "ChevronsRight", "ChevronsRightLeft", "ChevronsUp", "ChevronsUpDown", "CircleArrowDown", "CircleArrowLeft", "CircleArrowOutDownLeft",
      "CircleArrowOutDownRight", "CircleArrowOutUpLeft", "CircleArrowOutUpRight", "CircleArrowRight", "CircleArrowUp", "CircleChevronDown",
      "CircleChevronLeft", "CircleChevronRight", "CircleChevronUp", "CircleFadingArrowUp", "ClipboardCopy", "ClipboardPaste", "CloudBackup",
      "CloudDownload", "CloudSync", "CloudUpload", "CornerDownLeft", "CornerDownRight", "CornerLeftDown", "CornerLeftUp", "CornerRightDown",
      "CornerRightUp", "CornerUpLeft", "CornerUpRight", "DatabaseBackup", "DecimalsArrowLeft", "DecimalsArrowRight", "Delete", "Download",
      "Expand", "ExternalLink", "FastForward", "FileDown", "FileInput", "FileOutput", "FileUp", "FoldHorizontal", "FoldVertical", "FolderDown",
      "FolderInput", "FolderOutput", "FolderSync", "FolderUp", "GitCompareArrows", "GitPullRequestArrow", "GitPullRequestCreateArrow",
      "HardDriveDownload", "HardDriveUpload", "History", "Import", "IterationCcw", "IterationCw", "LassoSelect", "ListChevronsDownUp",
      "ListChevronsUpDown", "LogIn", "LogOut", "Maximize2", "Merge", "Milestone", "Minimize2", "MousePointer", "MousePointer2",
      "MousePointer2Off", "MousePointerBan", "MousePointerClick", "Move", "MoveDiagonal", "MoveDiagonal2", "MoveDown", "MoveDownLeft",
      "MoveDownRight", "MoveHorizontal", "MoveLeft", "MoveRight", "MoveUp", "MoveUpLeft", "MoveUpRight", "MoveVertical", "PanelBottomClose",
      "PanelBottomOpen", "PanelLeftClose", "PanelLeftOpen", "PanelRightClose", "PanelRightOpen", "PanelTopClose", "PanelTopOpen",
      "PhoneForwarded", "PhoneIncoming", "PhoneOutgoing", "Play", "Redo", "Redo2", "RedoDot", "RefreshCcw", "RefreshCcwDot", "RefreshCw",
      "RefreshCwOff", "Repeat", "Repeat2", "Rewind", "RotateCcw", "RotateCcwSquare", "RotateCw", "RotateCwSquare", "SeparatorHorizontal",
      "SeparatorVertical", "Shrink", "Shuffle", "Signpost", "SignpostBig", "SkipBack", "SkipForward", "SplinePointer", "Split",
      "SquareArrowDown", "SquareArrowDownLeft", "SquareArrowDownRight", "SquareArrowLeft", "SquareArrowOutDownLeft", "SquareArrowOutDownRight",
      "SquareArrowOutUpLeft", "SquareArrowOutUpRight", "SquareArrowRight", "SquareArrowUp", "SquareArrowUpLeft", "SquareArrowUpRight",
      "SquareChevronDown", "SquareChevronLeft", "SquareChevronRight", "SquareChevronUp", "SquareDashedMousePointer", "SquareMousePointer",
      "SquarePlay", "StepBack", "StepForward", "Sunrise", "Sunset", "TextWrap", "TrendingDown", "TrendingUp", "TrendingUpDown", "Undo", "Undo2",
      "UndoDot", "UnfoldHorizontal", "UnfoldVertical", "Upload",
    ],
    "Brands": [
      "Airplay", "Bitcoin", "Chromium", "Codepen", "Codesandbox", "Dribbble", "Facebook", "Figma", "Framer", "Github", "Gitlab", "Hexagon",
      "Instagram", "Linkedin", "Pocket", "Slack", "Target", "Trello", "Twitch", "Twitter", "Youtube",
    ],
    "Buildings": [
      "Anvil", "BrickWall", "Building", "Building2", "Castle", "Church", "Cuboid", "Dam", "Factory", "Fence", "GraduationCap", "Hospital",
      "Hotel", "House", "HouseHeart", "HousePlug", "HousePlus", "HouseWifi", "Landmark", "School", "Store", "Theater", "University",
      "UtilityPole", "Warehouse",
    ],
    "Charts": [
      "ChartArea", "ChartBar", "ChartBarBig", "ChartBarDecreasing", "ChartBarIncreasing", "ChartBarStacked", "ChartCandlestick", "ChartColumn",
      "ChartColumnBig", "ChartColumnDecreasing", "ChartColumnIncreasing", "ChartColumnStacked", "ChartGantt", "ChartLine", "ChartNetwork",
      "ChartNoAxesColumn", "ChartNoAxesColumnDecreasing", "ChartNoAxesColumnIncreasing", "ChartNoAxesCombined", "ChartNoAxesGantt", "ChartPie",
      "ChartScatter", "ChartSpline", "FolderKanban", "Kanban", "SquareChartGantt", "SquareDashedKanban", "SquareKanban", "TrendingDown",
      "TrendingUp", "TrendingUpDown",
    ],
    "Coding & development": [
      "Ampersand", "Ampersands", "AppWindow", "AppWindowMac", "ArrowBigUp", "ArrowBigUpDash", "ArrowDownToLine", "ArrowRightToLine",
      "ArrowUpFromLine", "Asterisk", "Binary", "Binoculars", "Bitcoin", "Blend", "Blocks", "Book", "BookAlert", "BookCheck", "BookCopy",
      "BookDashed", "BookDown", "BookKey", "BookLock", "BookMarked", "BookMinus", "BookOpen", "BookOpenCheck", "BookOpenText", "BookPlus",
      "BookSearch", "BookUp", "BookUp2", "Bot", "BotMessageSquare", "BotOff", "Box", "Boxes", "Braces", "Brackets", "BrainCircuit", "BrainCog",
      "Bug", "BugOff", "BugPlay", "CaseLower", "CaseUpper", "ChartNoAxesGantt", "ChevronRight", "CircleArrowOutUpLeft", "CircleDashed",
      "CircleDot", "CircleDotDashed", "CircleEllipsis", "CircleFadingArrowUp", "CirclePlus", "CircleSlash", "CircleSlash2", "CircleX",
      "CircuitBoard", "CloudAlert", "CloudCheck", "CloudCog", "Code", "CodeXml", "Codepen", "Codesandbox", "Combine", "Command", "Component",
      "Computer", "Construction", "Container", "CopySlash", "CornerDownRight", "Database", "DatabaseBackup", "DatabaseZap", "Diff", "Divide",
      "Dock", "EarthLock", "Eclipse", "Ellipsis", "Equal", "EqualNot", "FileBraces", "FileBracesCorner", "FileCode", "FileCodeCorner",
      "FileDiff", "FileDigit", "FileSliders", "FileStack", "FileTerminal", "FlagTriangleLeft", "FlagTriangleRight", "FolderCode", "FolderDot",
      "FolderKanban", "FolderOpenDot", "FolderRoot", "Form", "GalleryHorizontal", "GalleryHorizontalEnd", "GalleryThumbnails", "GalleryVertical",
      "GalleryVerticalEnd", "Gem", "GitBranch", "GitBranchMinus", "GitBranchPlus", "GitCommitHorizontal", "GitCommitVertical", "GitCompare",
      "GitCompareArrows", "GitFork", "GitGraph", "GitMerge", "GitPullRequest", "GitPullRequestArrow", "GitPullRequestClosed",
      "GitPullRequestCreate", "GitPullRequestCreateArrow", "GitPullRequestDraft", "Github", "Gitlab", "GlobeLock", "HardDrive",
      "HardDriveDownload", "HardDriveUpload", "Hexagon", "Kanban", "Keyboard", "KeyboardOff", "Library", "LibraryBig", "ListIndentDecrease",
      "ListIndentIncrease", "Merge", "MessageCircleCode", "MessageSquareCode", "MessageSquareDiff", "Milestone", "Minus", "MonitorCloud",
      "Network", "Omega", "Option", "Package", "Package2", "PackageCheck", "PackageMinus", "PackageOpen", "PackagePlus", "PackageSearch",
      "PackageX", "PanelTop", "PanelsTopLeft", "Parentheses", "Percent", "Pi", "Plug", "Plug2", "Plus", "Puzzle", "QrCode", "Radical",
      "RectangleCircle", "RectangleEllipsis", "RefreshCcwDot", "Regex", "Rocket", "Router", "Rss", "Scroll", "ScrollText", "SearchCode",
      "Server", "ServerCog", "ServerCrash", "ServerOff", "Shell", "Shield", "ShieldAlert", "ShieldBan", "ShieldCheck", "ShieldEllipsis",
      "ShieldHalf", "ShieldMinus", "ShieldOff", "ShieldPlus", "ShieldQuestionMark", "ShieldUser", "ShieldX", "Signpost", "SignpostBig", "Slack",
      "Slash", "SpellCheck", "SpellCheck2", "Split", "SquareAsterisk", "SquareBottomDashedScissors", "SquareChartGantt", "SquareChevronRight",
      "SquareCode", "SquareDashedBottom", "SquareDashedBottomCode", "SquareDashedKanban", "SquareDashedMousePointer", "SquareDashedTopSolid",
      "SquareDot", "SquareFunction", "SquareKanban", "SquareLibrary", "SquareMinus", "SquareMousePointer", "SquarePi", "SquarePlus",
      "SquareRadical", "SquareRoundCorner", "SquareScissors", "SquareSlash", "SquareStack", "SquareTerminal", "SquircleDashed",
      "TableProperties", "TabletSmartphone", "Telescope", "Terminal", "ToggleLeft", "ToggleRight", "ToolCase", "ToyBrick", "Trello",
      "TriangleAlert", "Unplug", "Variable", "Waypoints", "Webhook", "WebhookOff", "Workflow", "Wrench",
    ],
    "Communication": [
      "Antenna", "AudioLines", "AudioWaveform", "BookUser", "Camera", "CameraOff", "CardSim", "CassetteTape", "Cctv",
      "ChevronsLeftRightEllipsis", "CircleFadingPlus", "Contact", "ContactRound", "EthernetPort", "HandFist", "Handshake", "HeadphoneOff",
      "Lectern", "Mic", "MicOff", "Newspaper", "Nfc", "Notebook", "NotebookTabs", "Phone", "PhoneCall", "PhoneForwarded", "PhoneIncoming",
      "PhoneMissed", "PhoneOff", "PhoneOutgoing", "Presentation", "Projector", "Radar", "ScreenShare", "ScreenShareOff", "Send",
      "SendHorizontal", "SmartphoneNfc", "SmilePlus", "Speech", "Spool", "Spotlight", "SwitchCamera", "Tv", "Video", "VideoOff", "Videotape",
      "Volume", "Volume1", "Volume2", "VolumeOff", "VolumeX", "Webcam",
    ],
    "Connectivity": [
      "Airplay", "Battery", "BatteryCharging", "BatteryFull", "BatteryLow", "BatteryMedium", "BatteryWarning", "Bluetooth", "BluetoothConnected",
      "BluetoothOff", "BluetoothSearching", "BookUser", "BrickWallFire", "BrickWallShield", "Cable", "CardSim", "CassetteTape", "Cast", "Cctv",
      "CirclePower", "CloudOff", "Contact", "ContactRound", "HeadphoneOff", "Headphones", "Headset", "HouseWifi", "Mic", "MicOff", "Monitor",
      "MonitorCheck", "MonitorCloud", "MonitorCog", "MonitorDot", "MonitorDown", "MonitorOff", "MonitorPause", "MonitorPlay",
      "MonitorSmartphone", "MonitorSpeaker", "MonitorStop", "MonitorUp", "MonitorX", "Phone", "PhoneCall", "PhoneForwarded", "PhoneIncoming",
      "PhoneMissed", "PhoneOff", "PhoneOutgoing", "Power", "PowerOff", "RectangleGoggles", "Router", "Satellite", "SatelliteDish", "ScreenShare",
      "ScreenShareOff", "Send", "SendHorizontal", "Signal", "SignalHigh", "SignalLow", "SignalMedium", "SignalZero", "Smartphone",
      "SmartphoneCharging", "SquarePower", "Vibrate", "VibrateOff", "Video", "VideoOff", "Videotape", "Voicemail", "Volume", "Volume1",
      "Volume2", "VolumeOff", "VolumeX", "Webcam", "Wifi", "WifiCog", "WifiHigh", "WifiLow", "WifiOff", "WifiPen", "WifiSync", "WifiZero", "Zap",
      "ZapOff",
    ],
    "Cursors": [
      "CirclePlus", "Hand", "HandGrab", "Lasso", "LassoSelect", "Loader", "LoaderCircle", "LoaderPinwheel", "MousePointer", "MousePointer2",
      "MousePointer2Off", "MousePointerBan", "MousePointerClick", "Move", "MoveDiagonal", "MoveDiagonal2", "MoveHorizontal", "MoveVertical",
      "PenTool", "Pencil", "PencilOff", "Plus", "Pointer", "PointerOff", "Sparkles", "SplinePointer", "SquareDashedMousePointer",
      "SquareMousePointer", "Stamp", "TextCursor", "TextSelect", "Wand", "WandSparkles",
    ],
    "Design": [
      "AArrowDown", "AArrowUp", "ALargeSmall", "AppWindow", "AppWindowMac", "Axis3d", "BetweenHorizontalEnd", "BetweenHorizontalStart",
      "BetweenVerticalEnd", "BetweenVerticalStart", "Blend", "BookType", "BringToFront", "Brush", "BrushCleaning", "ChartNoAxesGantt",
      "Columns2", "Columns3", "Columns3Cog", "Columns4", "Component", "Contrast", "Crop", "Cylinder", "DatabaseBackup", "DecimalsArrowLeft",
      "DecimalsArrowRight", "Diameter", "Dock", "DraftingCompass", "Dribbble", "Eclipse", "Eye", "EyeClosed", "EyeOff", "Figma", "FileAxis3d",
      "FlipHorizontal", "FlipHorizontal2", "FlipVertical", "FlipVertical2", "FolderKanban", "Frame", "Framer", "Fullscreen", "GalleryHorizontal",
      "GalleryHorizontalEnd", "GalleryThumbnails", "GalleryVertical", "GalleryVerticalEnd", "Grid2x2", "Grid3x2", "Grid3x3", "HandGrab",
      "Highlighter", "IterationCcw", "IterationCw", "Kanban", "LandPlot", "Lasso", "LassoSelect", "Layers", "Layers2", "LayersPlus",
      "LayoutDashboard", "LayoutGrid", "LayoutList", "LayoutPanelLeft", "LineSquiggle", "Loader", "LoaderPinwheel", "Magnet", "Maximize",
      "Maximize2", "Minimize", "Minimize2", "Move3d", "Notebook", "Origami", "PaintBucket", "PaintRoller", "Paintbrush", "PaintbrushVertical",
      "Palette", "PanelTop", "PanelsTopLeft", "Paperclip", "Pen", "PenLine", "PenOff", "PenTool", "Pencil", "PencilLine", "PencilOff",
      "PencilRuler", "Pipette", "Presentation", "Proportions", "Radius", "Ratio", "RectangleHorizontal", "RectangleVertical", "Rotate3d",
      "RotateCcw", "RotateCcwSquare", "RotateCw", "RotateCwSquare", "Rows2", "Rows3", "Rows4", "Ruler", "RulerDimensionLine", "Scale3d",
      "Scaling", "Scissors", "ScissorsLineDashed", "SendToBack", "Slice", "Spline", "SplinePointer", "SprayCan", "SquareBottomDashedScissors",
      "SquareChartGantt", "SquareDashed", "SquareDashedKanban", "SquareDashedTopSolid", "SquareKanban", "SquareRoundCorner", "SquareScissors",
      "SquaresExclude", "SquaresIntersect", "SquaresSubtract", "SquaresUnite", "SquircleDashed", "Stamp", "SwatchBook", "TabletSmartphone",
      "Tangent", "Torus", "VectorSquare", "View", "Wand", "WandSparkles", "ZoomIn", "ZoomOut",
    ],
    "Devices": [
      "Airplay", "AlarmClock", "AlarmClockCheck", "AlarmClockMinus", "AlarmClockOff", "AlarmClockPlus", "AlarmSmoke", "Antenna", "Battery",
      "BatteryCharging", "BatteryFull", "BatteryLow", "BatteryMedium", "BatteryPlus", "BatteryWarning", "BellElectric", "Bluetooth",
      "BluetoothConnected", "BluetoothOff", "BluetoothSearching", "BoomBox", "Cable", "Calculator", "Camera", "CameraOff", "CardSim",
      "CassetteTape", "Cast", "Cctv", "ChevronsLeftRightEllipsis", "Computer", "Cpu", "Database", "DatabaseBackup", "DatabaseZap",
      "DiamondMinus", "DiamondPlus", "Disc", "Disc2", "Disc3", "DiscAlbum", "Drill", "Drone", "Drum", "EarthLock", "EthernetPort",
      "FingerprintPattern", "Flashlight", "FlashlightOff", "Gamepad", "Gamepad2", "GamepadDirectional", "GlobeLock", "Gpu", "HardDrive",
      "HardDriveDownload", "HardDriveUpload", "Hd", "HdmiPort", "HeadphoneOff", "Headphones", "Headset", "Heater", "Joystick", "Keyboard",
      "KeyboardMusic", "KeyboardOff", "Laptop", "LaptopMinimal", "LaptopMinimalCheck", "MemoryStick", "Mic", "MicOff", "MicVocal", "Microchip",
      "Monitor", "MonitorCheck", "MonitorCloud", "MonitorCog", "MonitorDot", "MonitorDown", "MonitorOff", "MonitorPause", "MonitorPlay",
      "MonitorSmartphone", "MonitorSpeaker", "MonitorStop", "MonitorUp", "MonitorX", "Mouse", "MouseOff", "Nfc", "PcCase", "Phone", "PhoneCall",
      "PhoneForwarded", "PhoneIncoming", "PhoneMissed", "PhoneOff", "PhoneOutgoing", "Piano", "Plug", "Plug2", "PlugZap", "Presentation",
      "Printer", "PrinterCheck", "Projector", "Proportions", "Radio", "RadioReceiver", "RadioTower", "RectangleGoggles", "Router",
      "SatelliteDish", "Scan", "ScanBarcode", "ScanEye", "ScanFace", "ScanLine", "ScanQrCode", "ScanText", "ScreenShare", "ScreenShareOff",
      "Server", "ServerCog", "ServerCrash", "ServerOff", "Smartphone", "SmartphoneCharging", "SmartphoneNfc", "Speaker", "Spotlight",
      "SquareMinus", "SwitchCamera", "Tablet", "TabletSmartphone", "Toilet", "Touchpad", "TouchpadOff", "Tv", "TvMinimal", "TvMinimalPlay",
      "Unplug", "Usb", "Vibrate", "VibrateOff", "Video", "VideoOff", "Videotape", "Voicemail", "Wallpaper", "WashingMachine", "Webcam", "Wifi",
      "WifiCog", "WifiHigh", "WifiLow", "WifiOff", "WifiPen", "WifiSync", "WifiZero", "Zap", "ZapOff",
    ],
    "Emoji": [
      "Angry", "Annoyed", "Balloon", "BicepsFlexed", "ChessBishop", "ChessKing", "ChessKnight", "ChessPawn", "ChessQueen", "ChessRook", "Frown",
      "HandFist", "HandHelping", "HandMetal", "Heart", "HeartCrack", "HeartHandshake", "Laugh", "LeafyGreen", "Meh", "PartyPopper", "Ribbon",
      "Salad", "Smile", "SmilePlus", "Star", "ThumbsDown", "ThumbsUp",
    ],
    "File icons": [
      "AppWindow", "AppWindowMac", "Archive", "ArchiveRestore", "ArchiveX", "ArrowBigDownDash", "ArrowDownFromLine", "ArrowDownToLine",
      "ArrowUpFromLine", "ArrowUpToLine", "BookImage", "Braces", "Brackets", "CalendarFold", "CassetteTape", "ChartPie", "CloudBackup",
      "CloudDownload", "CloudSync", "CloudUpload", "Combine", "Diff", "Dock", "Download", "File", "FileArchive", "FileAxis3d", "FileBadge",
      "FileBox", "FileBraces", "FileBracesCorner", "FileChartColumn", "FileChartColumnIncreasing", "FileChartLine", "FileChartPie", "FileCheck",
      "FileCheckCorner", "FileClock", "FileCode", "FileCodeCorner", "FileCog", "FileDiff", "FileDigit", "FileDown", "FileExclamationPoint",
      "FileHeadphone", "FileHeart", "FileImage", "FileInput", "FileKey", "FileLock", "FileMinus", "FileMinusCorner", "FileMusic", "FileOutput",
      "FilePen", "FilePenLine", "FilePlay", "FilePlus", "FilePlusCorner", "FileQuestionMark", "FileScan", "FileSearch", "FileSearchCorner",
      "FileSignal", "FileSliders", "FileSpreadsheet", "FileStack", "FileSymlink", "FileTerminal", "FileText", "FileType", "FileTypeCorner",
      "FileUp", "FileUser", "FileVideoCamera", "FileVolume", "FileX", "FileXCorner", "Files", "Folder", "FolderArchive", "FolderCheck",
      "FolderClock", "FolderClosed", "FolderCode", "FolderCog", "FolderDot", "FolderDown", "FolderGit", "FolderGit2", "FolderHeart",
      "FolderInput", "FolderKanban", "FolderKey", "FolderLock", "FolderMinus", "FolderOpen", "FolderOpenDot", "FolderOutput", "FolderPen",
      "FolderPlus", "FolderRoot", "FolderSearch", "FolderSearch2", "FolderSymlink", "FolderSync", "FolderTree", "FolderUp", "FolderX", "Folders",
      "GalleryHorizontalEnd", "GalleryVerticalEnd", "Group", "HardDriveDownload", "HardDriveUpload", "Headphones", "Headset", "Image",
      "ImageDown", "ImageMinus", "ImageOff", "ImagePlay", "ImagePlus", "ImageUp", "Images", "Import", "ListTree", "MessageSquareDiff", "Music",
      "Music2", "Music3", "Music4", "Package", "Package2", "PackageOpen", "PackageSearch", "Paperclip", "Parentheses", "Save", "SaveAll",
      "SaveOff", "Sheet", "Shredder", "SquareBottomDashedScissors", "SquareDashedBottom", "SquareDashedBottomCode", "SquareScissors",
      "SquareStack", "Table", "Table2", "TableCellsMerge", "TableCellsSplit", "TableColumnsSplit", "TableProperties", "TableRowsSplit", "Trash",
      "Trash2", "Ungroup", "Upload", "Videotape", "WifiCog",
    ],
    "Finance": [
      "BadgeCent", "BadgeDollarSign", "BadgeEuro", "BadgeIndianRupee", "BadgeJapaneseYen", "BadgePercent", "BadgePoundSterling",
      "BadgeRussianRuble", "BadgeSwissFranc", "BadgeTurkishLira", "Banknote", "BanknoteArrowDown", "BanknoteArrowUp", "BanknoteX", "Bitcoin",
      "ChartCandlestick", "CircleDollarSign", "CirclePercent", "CirclePoundSterling", "CreditCard", "Currency", "DiamondPercent", "DollarSign",
      "Euro", "Gem", "GeorgianLari", "HandCoins", "Handshake", "IndianRupee", "JapaneseYen", "Landmark", "Nfc", "Percent", "PhilippinePeso",
      "PiggyBank", "PoundSterling", "Receipt", "ReceiptCent", "ReceiptEuro", "ReceiptIndianRupee", "ReceiptJapaneseYen", "ReceiptPoundSterling",
      "ReceiptRussianRuble", "ReceiptSwissFranc", "ReceiptText", "ReceiptTurkishLira", "RussianRuble", "SaudiRiyal", "Scale", "SmartphoneNfc",
      "SquarePercent", "SwissFranc", "TurkishLira", "Wallet", "WalletCards", "WalletMinimal",
    ],
    "Food & beverage": [
      "Amphora", "Apple", "Banana", "Barrel", "Bean", "BeanOff", "Beef", "Beer", "BeerOff", "BottleWine", "Cake", "CakeSlice", "Candy",
      "CandyCane", "CandyOff", "Carrot", "ChefHat", "Cherry", "Citrus", "Coffee", "Cookie", "CookingPot", "Croissant", "CupSoda", "Dessert",
      "DnaOff", "Donut", "Drumstick", "Egg", "EggFried", "EggOff", "Fish", "FishOff", "FishSymbol", "GlassWater", "Grape", "Ham", "Hamburger",
      "HandPlatter", "Hop", "HopOff", "IceCreamBowl", "IceCreamCone", "LeafyGreen", "Lollipop", "Martini", "Microwave", "Milk", "MilkOff", "Nut",
      "NutOff", "Pizza", "Popcorn", "Popsicle", "Refrigerator", "Salad", "Sandwich", "Shell", "Snail", "Soup", "Torus", "Tractor", "Utensils",
      "UtensilsCrossed", "Vegan", "Wheat", "WheatOff", "Wine", "WineOff",
    ],
    "Gaming": [
      "Amphora", "Anvil", "ArrowBigDown", "ArrowBigDownDash", "ArrowBigLeft", "ArrowBigLeftDash", "ArrowBigRight", "ArrowBigRightDash",
      "ArrowBigUp", "ArrowBigUpDash", "Award", "Axe", "Backpack", "Beaker", "Bone", "Book", "BookA", "BookAlert", "BookCheck", "BookCopy",
      "BookHeart", "BookKey", "BookLock", "BookMarked", "BookMinus", "BookOpen", "BookOpenCheck", "BookPlus", "BookSearch", "BookText",
      "BookType", "BookX", "BowArrow", "Box", "Boxes", "Castle", "ChessBishop", "ChessKing", "ChessKnight", "ChessPawn", "ChessQueen",
      "ChessRook", "ChevronDown", "ChevronUp", "ChevronsDown", "ChevronsLeft", "ChevronsLeftRightEllipsis", "ChevronsRight", "ChevronsUp",
      "CircleArrowDown", "CircleArrowLeft", "CircleArrowRight", "CircleArrowUp", "CirclePlus", "CircleStar", "Clover", "Club", "Coins",
      "Computer", "Crown", "Diamond", "Dice1", "Dice2", "Dice3", "Dice4", "Dice5", "Dice6", "Dices", "Droplet", "DropletOff", "EthernetPort",
      "Feather", "Flame", "FlameKindling", "FlaskConical", "FlaskConicalOff", "FlaskRound", "Flower", "Gamepad", "Gamepad2",
      "GamepadDirectional", "Gem", "Ghost", "Gift", "Goal", "Gpu", "HdmiPort", "HeadphoneOff", "Headphones", "Headset", "Heart", "HeartMinus",
      "HeartPlus", "Hourglass", "Joystick", "LandPlot", "Medal", "MemoryStick", "Milestone", "Mountain", "PcCase", "Pickaxe", "Plus", "Puzzle",
      "RectangleGoggles", "Rocket", "Scan", "Scroll", "ScrollText", "Shapes", "Shield", "ShieldAlert", "ShieldBan", "ShieldCheck",
      "ShieldEllipsis", "ShieldHalf", "ShieldMinus", "ShieldOff", "ShieldPlus", "ShieldQuestionMark", "ShieldX", "Shovel", "Signpost",
      "SignpostBig", "Skull", "Spade", "Sparkles", "Sprout", "SquareArrowDown", "SquareArrowDownLeft", "SquareArrowDownRight", "SquareStar",
      "Star", "Sword", "Swords", "Tally1", "Tally2", "Tally3", "Tally4", "Tally5", "Target", "ToyBrick", "Trophy", "Twitch", "VenetianMask",
      "Volleyball", "Wand", "WandSparkles",
    ],
    "Home": [
      "AirVent", "AlarmSmoke", "Armchair", "Bed", "BedDouble", "BedSingle", "BellElectric", "Birdhouse", "Blinds", "Bolt", "BrickWall",
      "BrickWallFire", "BrickWallShield", "BrushCleaning", "CookingPot", "DoorClosed", "DoorClosedLocked", "DoorOpen", "Drill", "Fan", "Fence",
      "FireExtinguisher", "Hammer", "Heater", "House", "HouseHeart", "HousePlug", "HouseWifi", "Lamp", "LampCeiling", "LampDesk", "LampFloor",
      "LampWallDown", "LampWallUp", "Microwave", "PaintRoller", "Paintbrush", "PaintbrushVertical", "Refrigerator", "RockingChair", "Rose",
      "Router", "Shell", "ShowerHead", "SoapDispenserDroplet", "Sofa", "SolarPanel", "SwatchBook", "Toilet", "ToolCase", "Turntable", "Usb",
      "UtilityPole", "Vault", "WashingMachine", "WavesLadder",
    ],
    "Layout": [
      "AlignCenterHorizontal", "AlignCenterVertical", "AlignEndHorizontal", "AlignEndVertical", "AlignHorizontalDistributeCenter",
      "AlignHorizontalDistributeEnd", "AlignHorizontalDistributeStart", "AlignHorizontalJustifyCenter", "AlignHorizontalJustifyEnd",
      "AlignHorizontalJustifyStart", "AlignHorizontalSpaceAround", "AlignHorizontalSpaceBetween", "AlignStartHorizontal", "AlignStartVertical",
      "AlignVerticalDistributeCenter", "AlignVerticalDistributeEnd", "AlignVerticalDistributeStart", "AlignVerticalJustifyCenter",
      "AlignVerticalJustifyEnd", "AlignVerticalJustifyStart", "AlignVerticalSpaceAround", "AlignVerticalSpaceBetween", "AppWindow",
      "AppWindowMac", "ArrowDown01", "ArrowDown10", "ArrowDownAZ", "ArrowDownNarrowWide", "ArrowDownWideNarrow", "ArrowDownZA", "ArrowUp01",
      "ArrowUp10", "ArrowUpAZ", "ArrowUpNarrowWide", "ArrowUpWideNarrow", "ArrowUpZA", "BetweenHorizontalEnd", "BetweenHorizontalStart",
      "BetweenVerticalEnd", "BetweenVerticalStart", "Blocks", "BringToFront", "CircleEllipsis", "Columns2", "Columns3", "Columns3Cog",
      "Columns4", "Dock", "Ellipsis", "EllipsisVertical", "FoldHorizontal", "FoldVertical", "Fullscreen", "Funnel", "FunnelPlus", "FunnelX",
      "GalleryHorizontal", "GalleryHorizontalEnd", "GalleryThumbnails", "GalleryVertical", "GalleryVerticalEnd", "Grid2x2", "Grid2x2Check",
      "Grid2x2Plus", "Grid2x2X", "Grid3x2", "Grid3x3", "Grip", "GripHorizontal", "GripVertical", "HandGrab", "Layers", "Layers2", "LayersPlus",
      "LayoutDashboard", "LayoutGrid", "LayoutList", "LayoutPanelLeft", "LayoutPanelTop", "LayoutTemplate", "ListFilterPlus", "ListTree",
      "Loader", "LoaderCircle", "Maximize", "Maximize2", "Menu", "Minimize", "Minimize2", "PanelBottom", "PanelBottomClose", "PanelBottomDashed",
      "PanelBottomOpen", "PanelLeft", "PanelLeftClose", "PanelLeftDashed", "PanelLeftOpen", "PanelLeftRightDashed", "PanelRight",
      "PanelRightClose", "PanelRightDashed", "PanelRightOpen", "PanelTop", "PanelTopBottomDashed", "PanelTopClose", "PanelTopDashed",
      "PanelTopOpen", "PanelsLeftBottom", "PanelsRightBottom", "PanelsTopLeft", "PencilRuler", "Proportions", "Ratio", "RotateCcwSquare",
      "RotateCwSquare", "Rows2", "Rows3", "Rows4", "Ruler", "RulerDimensionLine", "SendToBack", "SeparatorHorizontal", "SeparatorVertical",
      "Shrink", "SquareDashedTopSolid", "SquareMenu", "SquareRoundCorner", "SquareSplitHorizontal", "SquareSplitVertical", "SquareSquare",
      "StretchHorizontal", "StretchVertical", "TextCursorInput", "ToggleLeft", "ToggleRight", "UnfoldHorizontal", "UnfoldVertical", "ZoomIn",
      "ZoomOut",
    ],
    "Mail": [
      "Archive", "ArchiveRestore", "ArchiveX", "ArrowsUpFromLine", "Container", "Forward", "Inbox", "Mail", "MailCheck", "MailMinus", "MailOpen",
      "MailPlus", "MailQuestionMark", "MailSearch", "MailWarning", "MailX", "Mailbox", "Mails", "Paperclip", "Reply", "ReplyAll", "Send",
      "SendHorizontal", "Shredder", "Trash", "Trash2",
    ],
    "Mathematics": [
      "Asterisk", "BadgePercent", "Box", "Calculator", "ChevronRight", "ChevronUp", "CircleDivide", "CircleEqual", "CircleMinus",
      "CirclePercent", "CirclePlus", "CircleSlash", "CircleSlash2", "CircleX", "Cone", "CopyMinus", "CopyPlus", "CopySlash", "CopyX", "Cuboid",
      "Cylinder", "DecimalsArrowLeft", "DecimalsArrowRight", "Diameter", "DiamondPercent", "Divide", "DraftingCompass", "Equal",
      "EqualApproximately", "EqualNot", "Grid2x2", "Grid2x2Check", "Grid2x2Plus", "Grid2x2X", "Grid3x2", "LandPlot", "LineSquiggle", "Minus",
      "OctagonX", "Omega", "Parentheses", "Percent", "Pi", "Plus", "Pyramid", "Radical", "Radius", "Sigma", "Slash", "SquareAsterisk",
      "SquareChevronUp", "SquareDivide", "SquareEqual", "SquareFunction", "SquareMinus", "SquarePercent", "SquarePi", "SquarePlus",
      "SquareRadical", "SquareSigma", "SquareSlash", "SquareX", "Tally1", "Tally2", "Tally3", "Tally4", "Tally5", "Tangent", "TriangleRight",
      "Variable", "VectorSquare", "Weight", "WeightTilde", "X",
    ],
    "Medical": [
      "Accessibility", "Activity", "Ambulance", "Bandage", "Bone", "Brain", "BriefcaseMedical", "Cigarette", "CigaretteOff", "CircleSmall",
      "ClipboardMinus", "ClipboardPlus", "Dna", "DnaOff", "Ear", "EarOff", "FingerprintPattern", "Heart", "HeartMinus", "HeartPlus",
      "HeartPulse", "Hospital", "HouseHeart", "HousePlus", "LifeBuoy", "Mars", "MarsStroke", "Microscope", "NonBinary", "Pill", "PillBottle",
      "Ribbon", "ScanHeart", "ShieldPlus", "Siren", "SquareActivity", "Stethoscope", "Syringe", "Tablets", "Transgender", "Venus",
      "VenusAndMars",
    ],
    "Multimedia": [
      "Activity", "Airplay", "Album", "Antenna", "AudioLines", "AudioWaveform", "BookAudio", "BookHeadphones", "BookImage", "BoomBox", "Cable",
      "Captions", "CaptionsOff", "CardSim", "CassetteTape", "ChevronFirst", "ChevronLast", "ChevronsLeftRightEllipsis", "CirclePause",
      "CirclePlay", "CircleStop", "Clapperboard", "ClosedCaption", "DiamondMinus", "DiamondPlus", "Disc", "Disc2", "Disc3", "DiscAlbum", "Drama",
      "Drum", "EthernetPort", "FastForward", "FileMusic", "Film", "Fullscreen", "GalleryHorizontal", "GalleryHorizontalEnd", "GalleryThumbnails",
      "GalleryVertical", "GalleryVerticalEnd", "Guitar", "HandMetal", "Hd", "HdmiPort", "HeadphoneOff", "Headphones", "Headset", "Heart",
      "HeartMinus", "HeartOff", "HeartPlus", "Image", "ImageDown", "ImageMinus", "ImageOff", "ImagePlay", "ImagePlus", "ImageUp", "ImageUpscale",
      "Images", "Infinity", "KeyboardMusic", "Lectern", "Library", "LibraryBig", "ListEnd", "ListMinus", "ListMusic", "ListPlus", "ListRestart",
      "ListStart", "ListVideo", "ListX", "Loader", "LoaderCircle", "Megaphone", "MegaphoneOff", "Mic", "MicOff", "MicVocal", "MonitorPause",
      "MonitorPlay", "MonitorStop", "Music", "Music2", "Music3", "Music4", "Newspaper", "OctagonPause", "Pause", "Piano", "PictureInPicture",
      "PictureInPicture2", "Play", "Podcast", "Popcorn", "Presentation", "Projector", "Radio", "RadioTower", "RectangleGoggles", "Repeat",
      "Repeat1", "Repeat2", "Rewind", "SatelliteDish", "ScanEye", "ScanSearch", "Shuffle", "SkipBack", "SkipForward", "Sparkles", "Speaker",
      "Spotlight", "Square", "SquareActivity", "SquareLibrary", "SquarePause", "SquarePlay", "SquareStop", "Star", "StarHalf", "StarOff",
      "StepBack", "StepForward", "Turntable", "Tv", "TvMinimal", "TvMinimalPlay", "Usb", "Volume", "Volume1", "Volume2", "VolumeOff", "VolumeX",
      "Waves", "Youtube",
    ],
    "Nature": [
      "Binoculars", "Birdhouse", "Cannabis", "CannabisOff", "Caravan", "FlameKindling", "Flower", "Flower2", "Leaf", "Mountain", "MountainSnow",
      "Rose", "Shell", "Shovel", "Shrub", "Sprout", "Stone", "Tent", "TentTree", "TreeDeciduous", "TreePalm", "TreePine", "Trees",
    ],
    "Navigation": [
      "Barrel", "Binoculars", "Birdhouse", "Castle", "Church", "CircleParking", "CircleParkingOff", "Compass", "Dam", "Dumbbell", "Earth",
      "EvCharger", "Factory", "FerrisWheel", "FlagTriangleLeft", "FlagTriangleRight", "Footprints", "Fuel", "Gavel", "GitCommitHorizontal",
      "GitCommitVertical", "Globe", "Hospital", "Hotel", "House", "Landmark", "Library", "LibraryBig", "Locate", "LocateFixed", "LocateOff",
      "Map", "MapMinus", "MapPin", "MapPinCheck", "MapPinCheckInside", "MapPinHouse", "MapPinMinus", "MapPinMinusInside", "MapPinOff",
      "MapPinPen", "MapPinPlus", "MapPinPlusInside", "MapPinX", "MapPinXInside", "MapPinned", "MapPlus", "Milestone", "Navigation",
      "Navigation2", "Navigation2Off", "NavigationOff", "ParkingMeter", "Pin", "PinOff", "Plane", "Radar", "RailSymbol", "RollerCoaster",
      "Route", "RouteOff", "Scale", "School", "Ship", "ShipWheel", "Signpost", "SignpostBig", "SquareChevronDown", "SquareChevronLeft",
      "SquareChevronRight", "SquareChevronUp", "SquareLibrary", "SquareM", "SquareParking", "SquareParkingOff", "Store", "TrainFrontTunnel",
      "TrainTrack", "University", "Utensils", "UtensilsCrossed", "Warehouse", "Waves", "Waypoints",
    ],
    "Notification": [
      "AlarmClock", "AlarmClockCheck", "AlarmClockMinus", "AlarmClockOff", "AlarmClockPlus", "Bell", "BellDot", "BellElectric", "BellMinus",
      "BellOff", "BellPlus", "BellRing", "Check", "CheckCheck", "CheckLine", "CircleAlert", "CircleCheck", "CircleCheckBig",
      "CircleQuestionMark", "CopyCheck", "CopyX", "FileExclamationPoint", "Info", "LaptopMinimalCheck", "Megaphone", "MegaphoneOff",
      "MessageCircleWarning", "MessageSquareDot", "MessageSquareWarning", "OctagonAlert", "OctagonX", "ShieldAlert", "SmilePlus", "SquareCheck",
      "SquareCheckBig", "SquareX", "TriangleAlert", "Vibrate", "X",
    ],
    "People": [
      "Baby", "HandPlatter", "PersonStanding",
    ],
    "Photography": [
      "Album", "Aperture", "Backpack", "Binoculars", "Blend", "BookImage", "Camera", "CameraOff", "Cctv", "Contrast", "Crop", "Crosshair",
      "DatabaseBackup", "DiamondMinus", "DiamondPlus", "Eclipse", "Eye", "EyeClosed", "EyeOff", "Film", "Flashlight", "FlashlightOff",
      "FlipHorizontal", "FlipHorizontal2", "FlipVertical", "FlipVertical2", "Focus", "Frame", "Fullscreen", "GalleryHorizontal",
      "GalleryHorizontalEnd", "GalleryThumbnails", "GalleryVertical", "GalleryVerticalEnd", "Image", "ImageDown", "ImageMinus", "ImageOff",
      "ImagePlay", "ImagePlus", "ImageUp", "ImageUpscale", "Images", "Instagram", "LayoutList", "Library", "LibraryBig", "Lightbulb",
      "LightbulbOff", "Paintbrush", "PaintbrushVertical", "Palette", "Presentation", "Projector", "Proportions", "Ratio", "RotateCcw",
      "RotateCcwSquare", "RotateCw", "RotateCwSquare", "ScanEye", "ScanSearch", "Spotlight", "SquareLibrary", "SwatchBook", "Video", "VideoOff",
      "Videotape", "View", "Wand", "WandSparkles", "Zap", "ZapOff", "ZoomIn", "ZoomOut",
    ],
    "Science": [
      "Activity", "Atom", "Beaker", "Binoculars", "Biohazard", "Brain", "BrainCircuit", "BrainCog", "CircleGauge", "CircuitBoard", "Eclipse",
      "FlaskConical", "FlaskConicalOff", "FlaskRound", "Gauge", "Microscope", "Omega", "Orbit", "Pipette", "Radiation", "Satellite", "Scale",
      "Shell", "Sigma", "SolarPanel", "SquareActivity", "Stethoscope", "Syringe", "Telescope", "TestTube", "TestTubeDiagonal", "TestTubes",
    ],
    "Seasons": [
      "Flower2", "Leaf", "Rose", "Snowflake", "Sun",
    ],
    "Security": [
      "Bomb", "BookKey", "BookLock", "BrickWallFire", "BrickWallShield", "Cctv", "Columns4", "DoorClosed", "DoorClosedLocked", "DoorOpen",
      "EarthLock", "Eye", "EyeClosed", "EyeOff", "FileKey", "FileLock", "FingerprintPattern", "FolderKey", "FolderLock", "GlobeLock",
      "Handshake", "HatGlasses", "HeartHandshake", "IdCard", "IdCardLanyard", "Key", "KeyRound", "KeySquare", "Lock", "LockKeyhole",
      "LockKeyholeOpen", "LockOpen", "Radar", "RotateCcwKey", "Scan", "ScanEye", "ScanFace", "ScanQrCode", "Shield", "ShieldAlert", "ShieldBan",
      "ShieldCheck", "ShieldEllipsis", "ShieldHalf", "ShieldMinus", "ShieldOff", "ShieldPlus", "ShieldQuestionMark", "ShieldUser", "ShieldX",
      "SquareAsterisk", "UserLock", "Vault", "Waypoints", "Worm",
    ],
    "Shapes": [
      "Badge", "BadgeQuestionMark", "Blocks", "Box", "Boxes", "Circle", "CircleDashed", "CircleDot", "CircleDotDashed", "CircleOff",
      "CirclePile", "CircleSlash2", "CircleSmall", "Club", "Cone", "Cross", "Cuboid", "Cylinder", "Diameter", "Diamond", "Dot", "Heart",
      "Hexagon", "LineSquiggle", "Octagon", "OctagonAlert", "OctagonPause", "Pentagon", "Pyramid", "Radius", "RectangleHorizontal",
      "RectangleVertical", "Shapes", "Shield", "Spade", "Sparkle", "Square", "Squircle", "SquircleDashed", "Star", "Tangent", "Torus",
      "Triangle", "TriangleAlert", "TriangleDashed", "TriangleRight", "Ungroup", "VectorSquare",
    ],
    "Shopping": [
      "BadgeCent", "BadgeDollarSign", "BadgeEuro", "BadgeIndianRupee", "BadgeJapaneseYen", "BadgePercent", "BadgePoundSterling",
      "BadgeRussianRuble", "BadgeSwissFranc", "BadgeTurkishLira", "Barcode", "BookImage", "CirclePercent", "DiamondPercent", "Handbag",
      "Percent", "Scan", "ScanBarcode", "ScanLine", "ScanQrCode", "Shirt", "ShoppingBag", "ShoppingBasket", "ShoppingCart", "SquarePercent",
      "Store", "TicketPercent",
    ],
    "Social": [
      "Activity", "Badge", "BadgeAlert", "BadgeCheck", "BadgeInfo", "BadgeMinus", "BadgePercent", "BadgePlus", "BadgeQuestionMark", "BadgeX",
      "BookHeart", "BookImage", "BookUser", "BoomBox", "Bot", "BotMessageSquare", "BotOff", "Cake", "CakeSlice", "CircleFadingPlus",
      "CirclePercent", "Contact", "ContactRound", "DiamondPercent", "Dribbble", "ExternalLink", "Facebook", "Flag", "FlagOff", "Flame",
      "FlameKindling", "HandFist", "HandHeart", "Handshake", "Hash", "HatGlasses", "Heart", "HeartMinus", "HeartOff", "HeartPlus", "Instagram",
      "Linkedin", "MessageCircle", "MessageCircleCode", "MessageCircleDashed", "MessageCircleHeart", "MessageCircleMore", "MessageCircleOff",
      "MessageCirclePlus", "MessageCircleQuestionMark", "MessageCircleReply", "MessageCircleWarning", "MessageCircleX", "MessageSquare",
      "MessageSquareCode", "MessageSquareDashed", "MessageSquareDiff", "MessageSquareDot", "MessageSquareHeart", "MessageSquareLock",
      "MessageSquareMore", "MessageSquareOff", "MessageSquarePlus", "MessageSquareQuote", "MessageSquareReply", "MessageSquareShare",
      "MessageSquareText", "MessageSquareWarning", "MessageSquareX", "MessagesSquare", "Notebook", "NotebookPen", "NotebookTabs", "NotebookText",
      "NotepadText", "NotepadTextDashed", "Podcast", "QrCode", "Radio", "RadioTower", "Repeat2", "Ribbon", "Rose", "Rss", "Scan", "ScanFace",
      "Search", "SearchAlert", "SearchCheck", "SearchCode", "SearchSlash", "SearchX", "Share", "Share2", "Slack", "SmilePlus", "Spool",
      "SquareActivity", "SquareArrowOutUpRight", "SquareArrowUpRight", "SquarePercent", "Star", "StarHalf", "StarOff", "Sticker", "StickyNote",
      "Theater", "ThumbsDown", "ThumbsUp", "Twitch", "Twitter", "UserRoundSearch", "UserSearch", "Voicemail", "Vote", "Waypoints", "Webhook",
      "WebhookOff", "Youtube",
    ],
    "Sports": [
      "Award", "CircleGauge", "CircleStar", "Dumbbell", "FishingHook", "Gauge", "HandFist", "LandPlot", "Medal", "SquareStar", "Trophy",
      "Volleyball", "WavesLadder",
    ],
    "Sustainability": [
      "Dam", "Flower", "Flower2", "HousePlug", "Leaf", "LeafyGreen", "Recycle", "Rose", "SolarPanel", "Sprout", "Sun", "Tent", "Tractor",
      "TreeDeciduous", "TreePalm", "TreePine", "Trees", "UtilityPole", "Vegan", "Waves", "WavesArrowDown", "WavesArrowUp", "Wind",
      "WindArrowDown",
    ],
    "Text formatting": [
      "AArrowDown", "AArrowUp", "ALargeSmall", "Ampersand", "Ampersands", "Anchor", "ArrowBigUp", "ArrowBigUpDash", "ArrowDown01", "ArrowDown10",
      "ArrowDownAZ", "ArrowDownNarrowWide", "ArrowDownWideNarrow", "ArrowDownZA", "ArrowUp01", "ArrowUp10", "ArrowUpAZ", "ArrowUpNarrowWide",
      "ArrowUpWideNarrow", "ArrowUpZA", "Asterisk", "AtSign", "Baseline", "Binary", "Bold", "Book", "BookA", "BookAlert", "BookAudio",
      "BookCheck", "BookCopy", "BookHeadphones", "BookHeart", "BookImage", "BookMarked", "BookMinus", "BookOpen", "BookOpenCheck",
      "BookOpenText", "BookPlus", "BookSearch", "BookText", "BookType", "BookX", "Brush", "CaseLower", "CaseSensitive", "CaseUpper",
      "CircleQuestionMark", "Clipboard", "ClipboardCheck", "ClipboardClock", "ClipboardCopy", "ClipboardList", "ClipboardMinus",
      "ClipboardPaste", "ClipboardPen", "ClipboardPenLine", "ClipboardPlus", "ClipboardType", "ClipboardX", "Code", "CodeXml", "Columns2",
      "Columns3", "Columns4", "Copy", "CopyCheck", "CopyMinus", "CopyPlus", "CopySlash", "Copyleft", "Copyright", "CornerDownRight",
      "CreativeCommons", "DecimalsArrowLeft", "DecimalsArrowRight", "Delete", "Dot", "Eraser", "Expand", "ExternalLink", "FileText", "FileType",
      "FileTypeCorner", "Grid2x2", "Grid2x2Check", "Grid2x2Plus", "Grid2x2X", "Grid3x2", "Grid3x3", "Hash", "Heading", "Heading1", "Heading2",
      "Heading3", "Heading4", "Heading5", "Heading6", "Highlighter", "Image", "ImageDown", "ImagePlay", "ImageUp", "Images", "Italic",
      "Keyboard", "KeyboardOff", "Languages", "LayoutList", "Library", "LibraryBig", "Ligature", "Link", "Link2", "Link2Off", "List",
      "ListCheck", "ListChecks", "ListChevronsDownUp", "ListChevronsUpDown", "ListCollapse", "ListEnd", "ListFilter", "ListFilterPlus",
      "ListIndentDecrease", "ListIndentIncrease", "ListMinus", "ListOrdered", "ListPlus", "ListRestart", "ListStart", "ListTodo", "ListTree",
      "ListX", "Logs", "Mail", "Map", "MessageSquareQuote", "Minus", "Notebook", "NotebookPen", "NotebookText", "NotepadText",
      "NotepadTextDashed", "Omega", "PaintRoller", "Paintbrush", "PaintbrushVertical", "Palette", "Paperclip", "Pen", "PenLine", "PenOff",
      "PenTool", "Pencil", "PencilLine", "PencilOff", "PencilRuler", "Phone", "Pilcrow", "PilcrowLeft", "PilcrowRight", "Pipette", "Plus",
      "Quote", "RectangleCircle", "RectangleEllipsis", "Redo", "Redo2", "RedoDot", "Regex", "RemoveFormatting", "Replace", "ReplaceAll", "Rows2",
      "Rows3", "Rows4", "Save", "SaveAll", "SaveOff", "ScanText", "Scissors", "Scroll", "ScrollText", "Search", "SearchAlert", "SearchCheck",
      "SearchCode", "SearchSlash", "SearchX", "Section", "SeparatorHorizontal", "SeparatorVertical", "Sheet", "Sigma", "Signature", "Space",
      "SpellCheck", "SpellCheck2", "SquareAsterisk", "SquareBottomDashedScissors", "SquareCode", "SquareDashed", "SquareLibrary", "SquareMinus",
      "SquarePen", "SquarePilcrow", "SquarePlus", "SquareScissors", "SquareSigma", "SquareStack", "StickyNote", "Strikethrough", "Subscript",
      "Superscript", "Table", "Table2", "TableCellsMerge", "TableCellsSplit", "TableColumnsSplit", "TableOfContents", "TableProperties",
      "TableRowsSplit", "TextAlignCenter", "TextAlignEnd", "TextAlignJustify", "TextAlignStart", "TextCursor", "TextCursorInput", "TextInitial",
      "TextQuote", "TextSearch", "TextSelect", "TextWrap", "Type", "TypeOutline", "Underline", "Undo", "Undo2", "UndoDot", "Unlink", "Unlink2",
      "WholeWord", "ZoomIn", "ZoomOut",
    ],
    "Time & calendar": [
      "AlarmClock", "AlarmClockCheck", "AlarmClockMinus", "AlarmClockOff", "AlarmClockPlus", "Calendar", "Calendar1", "CalendarArrowDown",
      "CalendarArrowUp", "CalendarCheck", "CalendarCheck2", "CalendarClock", "CalendarCog", "CalendarDays", "CalendarFold", "CalendarHeart",
      "CalendarMinus", "CalendarMinus2", "CalendarOff", "CalendarPlus", "CalendarPlus2", "CalendarRange", "CalendarSearch", "CalendarSync",
      "CalendarX", "CalendarX2", "Calendars", "ChartNoAxesGantt", "ClipboardClock", "Clock", "Clock1", "Clock10", "Clock11", "Clock12", "Clock2",
      "Clock3", "Clock4", "Clock5", "Clock6", "Clock7", "Clock8", "Clock9", "ClockAlert", "ClockArrowDown", "ClockArrowUp", "ClockCheck",
      "ClockFading", "ClockPlus", "FileClock", "FolderClock", "History", "Hourglass", "SquareChartGantt", "Sunrise", "Timer", "TimerOff",
      "TimerReset", "Watch",
    ],
    "Tools": [
      "Anvil", "Axe", "BetweenHorizontalEnd", "BetweenHorizontalStart", "BetweenVerticalEnd", "BetweenVerticalStart", "Blend", "Bolt", "Bomb",
      "BowArrow", "Brush", "BrushCleaning", "Diameter", "DiamondMinus", "DiamondPlus", "DraftingCompass", "Drill", "FireExtinguisher", "Gavel",
      "Hammer", "HardHat", "InspectionPanel", "LandPlot", "Minus", "PaintBucket", "PaintRoller", "Paintbrush", "PaintbrushVertical", "Pen",
      "PenLine", "PenOff", "Pencil", "PencilLine", "PencilOff", "PencilRuler", "Pickaxe", "Plus", "PocketKnife", "Radius", "RotateCcwSquare",
      "RotateCwSquare", "Ruler", "RulerDimensionLine", "Scissors", "ScissorsLineDashed", "Shovel", "SplinePointer", "Spool", "SprayCan",
      "SquareBottomDashedScissors", "SquareDashedMousePointer", "SquareMinus", "SquareMousePointer", "SquarePlus", "SquareScissors", "Stamp",
      "Sword", "Swords", "TabletSmartphone", "Tangent", "Telescope", "ToolCase", "Torus", "VectorSquare", "Wrench",
    ],
    "Transportation": [
      "Ambulance", "Anchor", "ArrowsUpFromLine", "BaggageClaim", "Bike", "Briefcase", "BriefcaseBusiness", "BriefcaseConveyorBelt",
      "BriefcaseMedical", "Bus", "BusFront", "CableCar", "Car", "CarFront", "CarTaxiFront", "Caravan", "Cigarette", "CigaretteOff",
      "CircleGauge", "CircleParking", "CircleParkingOff", "Container", "Drone", "EvCharger", "Forklift", "Fuel", "Gauge", "Handbag",
      "Helicopter", "Kayak", "Luggage", "Motorbike", "OctagonMinus", "ParkingMeter", "Plane", "PlaneLanding", "PlaneTakeoff", "RailSymbol",
      "Sailboat", "Scooter", "Ship", "ShipWheel", "SquareM", "SquareParking", "SquareParkingOff", "Ticket", "TicketCheck", "TicketMinus",
      "TicketPercent", "TicketPlus", "TicketSlash", "TicketX", "Tickets", "TicketsPlane", "TowerControl", "Tractor", "TrafficCone", "TrainFront",
      "TrainFrontTunnel", "TrainTrack", "TramFront", "Truck", "TruckElectric", "Van",
    ],
    "Travel": [
      "AlarmSmoke", "Backpack", "BaggageClaim", "Bath", "Binoculars", "BookImage", "BriefcaseConveyorBelt", "CableCar", "Caravan", "Cigarette",
      "CigaretteOff", "Compass", "ConciergeBell", "DoorClosed", "DoorClosedLocked", "DoorOpen", "FireExtinguisher", "FishingHook", "Heater",
      "Helicopter", "Hospital", "Hotel", "Luggage", "MapMinus", "MapPin", "MapPinCheck", "MapPinCheckInside", "MapPinHouse", "MapPinMinus",
      "MapPinMinusInside", "MapPinOff", "MapPinPen", "MapPinPlus", "MapPinPlusInside", "MapPinX", "MapPinXInside", "MapPinned", "Plane",
      "PlaneLanding", "PlaneTakeoff", "Pyramid", "Receipt", "ReceiptCent", "ReceiptEuro", "ReceiptIndianRupee", "ReceiptJapaneseYen",
      "ReceiptPoundSterling", "ReceiptRussianRuble", "ReceiptSwissFranc", "ReceiptText", "ReceiptTurkishLira", "Sailboat", "Shell", "Ship",
      "ShipWheel", "ShowerHead", "SoapDispenserDroplet", "Tent", "TentTree", "Tickets", "TicketsPlane", "TowerControl", "Utensils",
      "UtensilsCrossed", "Vault", "Volleyball", "WashingMachine",
    ],
    "Weather": [
      "Bubbles", "Cloud", "CloudDrizzle", "CloudFog", "CloudHail", "CloudLightning", "CloudMoon", "CloudMoonRain", "CloudOff", "CloudRain",
      "CloudRainWind", "CloudSnow", "CloudSun", "CloudSunRain", "Cloudy", "Droplet", "DropletOff", "Droplets", "Flame", "Haze", "MoonStar",
      "Rainbow", "Snowflake", "SolarPanel", "Sparkles", "Star", "Sun", "SunDim", "SunMedium", "SunSnow", "Sunrise", "Sunset", "Thermometer",
      "ThermometerSnowflake", "ThermometerSun", "Tornado", "Umbrella", "UmbrellaOff", "Waves", "WavesArrowDown", "WavesArrowUp", "Wind",
      "WindArrowDown", "Zap", "ZapOff",
    ],
  };

  const ALL_ICONS = Object.values(ICON_CATEGORIES).flat().filter((v, i, a) => a.indexOf(v) === i);

  // Helper function to search icons by name, tags, and categories
  const matchesIconSearch = (iconName: string, searchTerm: string): boolean => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const name = iconName.toLowerCase();
    // Match icon name (bidirectional)
    if (name.includes(term) || term.includes(name)) return true;
    // Match tags and categories from search data (bidirectional)
    const meta = ICON_SEARCH_DATA[iconName];
    if (meta) {
      if (meta.tags.some(tag => {
        const t = tag.toLowerCase();
        return t.includes(term) || term.includes(t);
      })) return true;
      if (meta.categories.some(cat => {
        const c = cat.toLowerCase();
        return c.includes(term) || term.includes(c);
      })) return true;
    }
    return false;
  };

  const flattenSkills = (skillList: Skill[]): Skill[] => {
    const result: Skill[] = [];
    const traverse = (skill: Skill) => { result.push(skill); skill.children?.forEach(traverse); };
    skillList.forEach(traverse);
    return result;
  };

  const allSkills = flattenSkills(skills);
  const filteredAllSkills = allSkills.filter(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const filterSkillTree = (skillList: Skill[]): Skill[] => {
    return skillList
      .map((skill): Skill | null => {
        const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
        const filteredChildren = skill.children ? filterSkillTree(skill.children) : [];
        if (matchesSearch || filteredChildren.length > 0) {
          return { ...skill, children: filteredChildren.length > 0 ? filteredChildren : skill.children };
        }
        return null;
      })
      .filter((skill): skill is Skill => skill !== null);
  };

  const filteredSkillTree = searchQuery ? filterSkillTree(skills) : skills;

  const getColorByIndex = (index: number) => COLORS[index % COLORS.length];
  const getSkillColor = (skill: Skill, fallbackIndex?: number) => {
    // Use skill's color property if set
    if (skill.color !== undefined) {
      return COLORS[skill.color % COLORS.length];
    }
    // Otherwise fall back to index-based color
    if (fallbackIndex !== undefined) {
      return getColorByIndex(fallbackIndex);
    }
    const rootIndex = skills.findIndex(s => {
      if (s.id === skill.id) return true;
      const findInChildren = (children: Skill[] | undefined): boolean => {
        if (!children) return false;
        return children.some(c => c.id === skill.id || findInChildren(c.children));
      };
      return findInChildren(s.children);
    });
    return getColorByIndex(rootIndex >= 0 ? rootIndex : 0);
  };

  const openCreateModal = () => { setNewSkillName(""); setNewSkillParentId(null); setNewSkillDescription(""); setNewSkillIcon("FileText"); setNewSkillColor(0); setIconSearch(""); setIconCategory("All"); setIsCreateModalOpen(true); };

  const handleCreate = () => {
    if (!newSkillName.trim()) return;
    const newSkill: Skill = {
      id: Math.max(...allSkills.map(s => s.id)) + 1,
      name: newSkillName,
      description: newSkillDescription || undefined,
      icon: newSkillIcon,
      parentId: newSkillParentId,
    };
    if (newSkillParentId === null) {
      setSkills([...skills, newSkill]);
    } else {
      const updateTree = (list: Skill[]): Skill[] => list.map(s => s.id === newSkillParentId ? { ...s, children: [...(s.children || []), newSkill] } : s.children ? { ...s, children: updateTree(s.children) } : s);
      setSkills(updateTree(skills));
    }
    setIsCreateModalOpen(false); setNewSkillName(""); setNewSkillParentId(null); setNewSkillDescription(""); setNewSkillIcon("FileText"); setNewSkillColor(0);
  };

  const handleUpdate = () => {
    if (!selectedSkill || !editName.trim()) return;
    const updatedSkill: Skill = {
      ...selectedSkill,
      name: editName,
      description: editDescription || undefined,
      icon: editIcon,
      color: editColor,
      parentId: editParentId,
    };
    const updateTree = (list: Skill[]): Skill[] => list.map(s => s.id === selectedSkill.id ? updatedSkill : s.children ? { ...s, children: updateTree(s.children) } : s);
    setSkills(updateTree(skills));
    setSelectedSkill(updatedSkill);
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (!selectedSkill) return;
    const removeSkill = (list: Skill[]): Skill[] => list.filter(s => s.id !== selectedSkill.id).map(s => ({ ...s, children: s.children ? removeSkill(s.children) : undefined }));
    setSkills(removeSkill(skills)); setSelectedSkill(null); setIsDeleteModalOpen(false);
  };

  const renderTree = (list: Skill[], depth = 0, parentColor?: typeof COLORS[0]) => (
    <div className={depth > 0 ? "ml-6 pl-6 border-l-2 border-dashed border-gray-200" : ""}>
      {list.map((skill, idx) => {
        const color = skill.color !== undefined
          ? COLORS[skill.color % COLORS.length]
          : (depth === 0 ? getColorByIndex(idx) : parentColor || COLORS[0]);
        const isSelected = selectedSkill?.id === skill.id;
        return (
          <div key={skill.id} className={`transition-all duration-500 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`} style={{ transitionDelay: `${idx * 50}ms` }}>
            <button
              onClick={() => router.push(`/demo/skills/us-6-1/${skill.id}`)}
              className={`group flex items-center gap-4 w-full p-4 mb-2 rounded-2xl text-left transition-all duration-300 ${
                isSelected
                  ? `${color.gradient} shadow-xl shadow-${color.bg}/25 text-white`
                  : "bg-white hover:bg-gray-50 border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50"
              }`}
            >
              <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isSelected ? "bg-white/25" : color.gradient
              }`}>
                <SkillIcon name={skill.icon} className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${isSelected ? "text-white" : "text-gray-800"}`}>{skill.name}</p>
                {skill.description && (
                  <p className={`text-sm truncate ${isSelected ? "text-white/70" : "text-gray-500"}`}>{skill.description}</p>
                )}
              </div>
              {skill.children && skill.children.length > 0 && (
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${isSelected ? "bg-white/25 text-white" : `${color.light} ${color.text}`}`}>
                  {skill.children.length}
                </div>
              )}
            </button>
            {skill.children && skill.children.length > 0 && renderTree(skill.children, depth + 1, color)}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 overflow-hidden">
      {/* Decorative Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-200/40 to-purple-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-200/40 to-cyan-200/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-pink-100/20 to-orange-100/20 blur-3xl" />
      </div>

      <div className="relative z-10">
        <DemoHeader
          storyId="US-6.1"
          title="Skill Management (Admin)"
          description="As an admin, I can create, update, and delete skills in a hierarchical structure"
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className={`rounded-3xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl shadow-gray-200/50 overflow-hidden transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                {/* Header */}
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
                  <div className="relative p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-white">
                        <h2 className="text-3xl font-black">Skill Library</h2>
                        <p className="text-white/70 mt-1 font-medium">Organize and manage your skill hierarchy</p>
                      </div>
                      <button
                        onClick={openCreateModal}
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-white rounded-2xl font-bold text-violet-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Skill
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search & Toggle */}
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:bg-white transition-all duration-300 font-medium"
                    />
                  </div>
                  <div className="flex p-1.5 bg-gray-100 rounded-2xl">
                    {[
                      { id: "grid", label: "Grid", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
                      { id: "tree", label: "Tree", icon: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" },
                    ].map(v => (
                      <button
                        key={v.id}
                        onClick={() => setViewMode(v.id as "grid" | "tree")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                          viewMode === v.id
                            ? "bg-white text-violet-600 shadow-lg"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={v.icon} />
                        </svg>
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[550px] overflow-y-auto">
                  {viewMode === "tree" ? (
                    filteredSkillTree.length > 0 ? renderTree(filteredSkillTree) : <EmptyState />
                  ) : (
                    filteredAllSkills.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredAllSkills.map((skill, idx) => {
                          const color = getSkillColor(skill);
                          const isSelected = selectedSkill?.id === skill.id;
                          return (
                            <button
                              key={skill.id}
                              onClick={() => router.push(`/demo/skills/us-6-1/${skill.id}`)}
                              className={`group relative p-5 rounded-2xl text-left transition-all duration-500 hover:scale-[1.02] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${
                                isSelected
                                  ? `${color.gradient} shadow-xl shadow-${color.bg}/30 text-white`
                                  : "bg-white hover:shadow-xl border border-gray-100"
                              }`}
                              style={{ transitionDelay: `${idx * 30}ms` }}
                            >
                              {!isSelected && <div className={`absolute inset-0 rounded-2xl ${color.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />}
                              <div className="relative flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                  isSelected ? "bg-white/25" : `${color.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3`
                                }`}>
                                  <SkillIcon name={skill.icon} className="w-7 h-7 text-white" strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className={`font-bold truncate ${isSelected ? "text-white" : "text-gray-800"}`}>{skill.name}</h3>
                                  {skill.description && (
                                    <p className={`text-sm mt-0.5 line-clamp-2 ${isSelected ? "text-white/70" : "text-gray-500"}`}>
                                      {skill.description}
                                    </p>
                                  )}
                                  {skill.children && skill.children.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                      {skill.children.slice(0, 2).map(child => (
                                        <span key={child.id} className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${isSelected ? "bg-white/20 text-white" : `${color.light} ${color.text}`}`}>
                                          {child.name}
                                        </span>
                                      ))}
                                      {skill.children.length > 2 && (
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                                          +{skill.children.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : <EmptyState />
                  )}
                </div>
          </div>

          <AcceptanceCriteriaSection storyId="US-6.1" />
        </main>
      </div>

      {/* Modals */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Skill" size="lg">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Skill Name</label>
            <input type="text" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="Enter skill name..." className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea value={newSkillDescription} onChange={(e) => setNewSkillDescription(e.target.value)} placeholder="Brief description of this skill..." rows={2} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium resize-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Parent Skill</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => { setParentDropdownOpen(!parentDropdownOpen); setParentSearch(""); }}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium cursor-pointer text-left"
              >
                <span>{newSkillParentId === null ? "None (Root Level)" : allSkills.find(s => s.id === newSkillParentId)?.name}</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${parentDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {parentDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={parentSearch}
                        onChange={(e) => setParentSearch(e.target.value)}
                        placeholder="Search skills..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border-0 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => { setNewSkillParentId(null); setParentDropdownOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${newSkillParentId === null ? "bg-violet-50 text-violet-700 font-medium" : "text-gray-700"}`}
                    >
                      {newSkillParentId === null && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      <span className={newSkillParentId === null ? "" : "ml-6"}>None (Root Level)</span>
                    </button>
                    {allSkills
                      .filter(s => s.name.toLowerCase().includes(parentSearch.toLowerCase()))
                      .map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { setNewSkillParentId(s.id); setParentDropdownOpen(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${newSkillParentId === s.id ? "bg-violet-50 text-violet-700 font-medium" : "text-gray-700"}`}
                        >
                          {newSkillParentId === s.id && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                          <span className={newSkillParentId === s.id ? "" : "ml-6"}>{s.name}</span>
                        </button>
                      ))}
                    {allSkills.filter(s => s.name.toLowerCase().includes(parentSearch.toLowerCase())).length === 0 && parentSearch && (
                      <p className="px-4 py-3 text-sm text-gray-400 text-center">No skills found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_COLORS.map((color, idx) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setNewSkillColor(idx)}
                  className={`w-10 h-10 rounded-xl ${color.class} transition-all duration-200 ${newSkillColor === idx ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Icon</label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
              <div className={`w-14 h-14 rounded-xl ${SKILL_COLORS[newSkillColor].class} flex items-center justify-center shadow-lg`}>
                <SkillIcon name={newSkillIcon} className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{newSkillIcon}</p>
                <p className="text-xs text-gray-500">Selected icon</p>
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  placeholder="Search by name, tag..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <select
                  value={iconCategory}
                  onChange={(e) => setIconCategory(e.target.value)}
                  className={`appearance-none h-full pl-3 pr-8 py-2.5 rounded-xl text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                    iconCategory !== "All"
                      ? `${SKILL_COLORS[newSkillColor].class} text-white`
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {Object.keys(ICON_CATEGORIES).map((category) => (
                    <option key={category} value={category} className="bg-white text-gray-800">
                      {category} {category !== "All" ? `(${ICON_CATEGORIES[category].length})` : ""}
                    </option>
                  ))}
                </select>
                <svg className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${iconCategory !== "All" ? "text-white" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {(() => {
              const filteredIcons = (iconCategory === "All" ? ALL_ICONS : ICON_CATEGORIES[iconCategory])
                .filter(name => matchesIconSearch(name, iconSearch));
              const hasMore = filteredIcons.length > iconsToShow;
              return (
                <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                  <div className="grid grid-cols-10 gap-1.5 max-h-48 overflow-y-auto p-2">
                    {filteredIcons.slice(0, iconsToShow).map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setNewSkillIcon(iconName)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${newSkillIcon === iconName ? `${SKILL_COLORS[newSkillColor].class} text-white scale-110` : "bg-white hover:bg-gray-100 text-gray-600"}`}
                        title={iconName}
                      >
                        <SkillIcon name={iconName} className="w-5 h-5" />
                      </button>
                    ))}
                    {filteredIcons.length === 0 && (
                      <p className="col-span-10 text-center text-gray-400 text-sm py-4">No icons found</p>
                    )}
                  </div>
                  {hasMore && (
                    <button
                      type="button"
                      onClick={() => setIconsToShow(prev => prev + 100)}
                      className="w-full py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 border-t border-gray-100 transition-colors"
                    >
                      Load more ({filteredIcons.length - iconsToShow} remaining)
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleCreate} className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/30">Create</button>
            <button onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all">Cancel</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Skill">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Skill Name</label>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Enter skill name..." className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Brief description of this skill..." rows={2} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium resize-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Parent Skill</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => { setEditParentDropdownOpen(!editParentDropdownOpen); setEditParentSearch(""); }}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium cursor-pointer text-left"
              >
                <span>{editParentId === null ? "None (Root Level)" : allSkills.find(s => s.id === editParentId)?.name}</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${editParentDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {editParentDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={editParentSearch}
                        onChange={(e) => setEditParentSearch(e.target.value)}
                        placeholder="Search skills..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border-0 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => { setEditParentId(null); setEditParentDropdownOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${editParentId === null ? "bg-violet-50 text-violet-700 font-medium" : "text-gray-700"}`}
                    >
                      {editParentId === null && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      <span className={editParentId === null ? "" : "ml-6"}>None (Root Level)</span>
                    </button>
                    {allSkills
                      .filter(s => s.id !== selectedSkill?.id)
                      .filter(s => s.name.toLowerCase().includes(editParentSearch.toLowerCase()))
                      .map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { setEditParentId(s.id); setEditParentDropdownOpen(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${editParentId === s.id ? "bg-violet-50 text-violet-700 font-medium" : "text-gray-700"}`}
                        >
                          {editParentId === s.id && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                          <span className={editParentId === s.id ? "" : "ml-6"}>{s.name}</span>
                        </button>
                      ))}
                    {allSkills.filter(s => s.id !== selectedSkill?.id).filter(s => s.name.toLowerCase().includes(editParentSearch.toLowerCase())).length === 0 && editParentSearch && (
                      <p className="px-4 py-3 text-sm text-gray-400 text-center">No skills found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_COLORS.map((color, idx) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setEditColor(idx)}
                  className={`w-8 h-8 rounded-full ${color.class} transition-all duration-200 ${editColor === idx ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-110"}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Icon</label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
              <div className={`w-14 h-14 rounded-xl ${SKILL_COLORS[editColor].class} flex items-center justify-center shadow-lg`}>
                <SkillIcon name={editIcon} className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{editIcon}</p>
                <p className="text-xs text-gray-500">Selected icon</p>
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={editIconSearch}
                  onChange={(e) => setEditIconSearch(e.target.value)}
                  placeholder="Search by name, tag..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <select
                  value={editIconCategory}
                  onChange={(e) => setEditIconCategory(e.target.value)}
                  className={`appearance-none h-full pl-3 pr-8 py-2.5 rounded-xl text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                    editIconCategory !== "All"
                      ? `${SKILL_COLORS[editColor].class} text-white`
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {Object.keys(ICON_CATEGORIES).map((category) => (
                    <option key={category} value={category} className="bg-white text-gray-800">
                      {category} {category !== "All" ? `(${ICON_CATEGORIES[category].length})` : ""}
                    </option>
                  ))}
                </select>
                <svg className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${editIconCategory !== "All" ? "text-white" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {(() => {
              const filteredIcons = (editIconCategory === "All" ? ALL_ICONS : ICON_CATEGORIES[editIconCategory])
                .filter(name => matchesIconSearch(name, editIconSearch));
              const hasMore = filteredIcons.length > editIconsToShow;
              return (
                <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                  <div className="grid grid-cols-10 gap-1.5 max-h-48 overflow-y-auto p-2">
                    {filteredIcons.slice(0, editIconsToShow).map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setEditIcon(iconName)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${editIcon === iconName ? `${SKILL_COLORS[editColor].class} text-white scale-110` : "bg-white hover:bg-gray-100 text-gray-600"}`}
                        title={iconName}
                      >
                        <SkillIcon name={iconName} className="w-5 h-5" />
                      </button>
                    ))}
                    {filteredIcons.length === 0 && (
                      <p className="col-span-10 text-center text-gray-400 text-sm py-4">No icons found</p>
                    )}
                  </div>
                  {hasMore && (
                    <button
                      type="button"
                      onClick={() => setEditIconsToShow(prev => prev + 100)}
                      className="w-full py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 border-t border-gray-100 transition-colors"
                    >
                      Load more ({filteredIcons.length - editIconsToShow} remaining)
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleUpdate} className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/30">Save</button>
            <button onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all">Cancel</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Skill" size="sm">
        <div className="space-y-5 text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-gray-600">Delete <span className="font-bold text-gray-900">{selectedSkill?.name}</span>?</p>
          {selectedSkill?.children && selectedSkill.children.length > 0 && (
            <p className="text-amber-600 text-sm bg-amber-50 rounded-xl p-3 font-medium">This will also delete {selectedSkill.children.length} sub-skill(s)</p>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={handleDelete} className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all">Delete</button>
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h3 className="text-xl font-black text-gray-800 mb-2">No skills found</h3>
      <p className="text-gray-500 font-medium">Try adjusting your search or add a new skill</p>
    </div>
  );
}
