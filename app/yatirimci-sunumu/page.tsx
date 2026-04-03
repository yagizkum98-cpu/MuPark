import { readFile } from "node:fs/promises";
import path from "node:path";
import Navbar from "@/components/Navbar";
import InvestorEbookShell, {
  type PresentationEmbedConfig,
  type VideoEmbedItem,
} from "@/components/investor/InvestorEbookShell";

const RUN_ROOT = path.join(
  process.cwd(),
  "investor-kit",
  "runs",
  "2026-02-21-yatirimci-demo"
);

const defaultVideos: VideoEmbedItem[] = [
  {
    id: "promo-tr",
    title: "MuPark Promo TR (Main)",
    provider: "youtube",
    videoId: "",
    status: "draft",
    visibility: "unlisted",
    language: "tr",
  },
  {
    id: "promo-en",
    title: "MuPark Promo EN",
    provider: "vimeo",
    videoId: "",
    status: "draft",
    visibility: "private",
    language: "en",
  },
  {
    id: "teaser-vertical",
    title: "MuPark Teaser 9:16",
    provider: "mp4",
    url: "",
    status: "review",
    visibility: "unlisted",
    language: "tr",
  },
];

const defaultPresentation: PresentationEmbedConfig = {
  title: "MuPark Investor Storybook ve Video Publish Hub",
  pdfUrl: "",
  pptUrl: "",
  ebookUrl: "",
  downloadUrl: "",
};

async function readPresentationConfig(): Promise<PresentationEmbedConfig> {
  const configPath = path.join(RUN_ROOT, "presentation", "embed-config.json");
  try {
    const raw = await readFile(configPath, "utf8");
    const parsed = JSON.parse(raw) as PresentationEmbedConfig;
    return { ...defaultPresentation, ...parsed };
  } catch {
    return defaultPresentation;
  }
}

async function readVideoConfig(): Promise<VideoEmbedItem[]> {
  const configPath = path.join(RUN_ROOT, "video", "publish-config.json");
  try {
    const raw = await readFile(configPath, "utf8");
    const parsed = JSON.parse(raw) as VideoEmbedItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultVideos;
    }
    return parsed;
  } catch {
    return defaultVideos;
  }
}

export default async function InvestorPresentationPage() {
  const presentation = await readPresentationConfig();
  const videos = await readVideoConfig();

  return (
    <>
      <Navbar />
      <InvestorEbookShell
        runPath="investor-kit/runs/2026-02-21-yatirimci-demo"
        presentation={presentation}
        videos={videos}
      />
    </>
  );
}
