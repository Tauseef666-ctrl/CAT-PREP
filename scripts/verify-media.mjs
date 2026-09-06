import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "scripts", "tmp");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function verifyVideo(c) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${c.youtubeId}&format=json`;
  try {
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    if (!res.ok) return { ...c, ok: false, status: res.status };
    const data = await res.json();
    return {
      ok: true,
      status: res.status,
      topicId: c.topicId,
      youtubeId: c.youtubeId,
      title: String(data.title ?? ""),
      channel: String(data.author_name ?? ""),
      language: c.language ?? "English",
      difficulty: c.difficulty ?? 3,
      type: c.type ?? "Complete Lecture",
      note: c.note ?? "",
      duration: c.duration ?? "",
    };
  } catch (e) {
    return { ...c, ok: false, error: String(e.message ?? e) };
  }
}

async function verifyPaper(p) {
  try {
    const res = await fetch(p.url, {
      method: "GET",
      headers: { "user-agent": "Mozilla/5.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(45000),
    });
    const ct = res.headers.get("content-type") ?? "";
    const buf = Buffer.from(await res.arrayBuffer());
    const isPdf = ct.includes("pdf") || buf.subarray(0, 5).toString("latin1") === "%PDF-";
    return {
      ok: (res.status === 200 || res.status === 206) && isPdf,
      status: res.status,
      title: p.title,
      url: p.url,
      year: p.year,
      weFound: isPdf,
      contentType: ct,
    };
  } catch (e) {
    return { ok: false, title: p.title, url: p.url, year: p.year, error: String(e.message ?? e) };
  }
}

async function main() {
  const videos = JSON.parse(readFileSync(join(dir, "videos-candidates.json"), "utf8"));
  const papers = JSON.parse(readFileSync(join(dir, "papers-candidates.json"), "utf8"));

  const vRes = [];
  for (let i = 0; i < videos.length; i++) {
    vRes.push(await verifyVideo(videos[i]));
    if (i % 25 === 24) {
      console.log(`videos ${i + 1}/${videos.length}`);
      await sleep(400);
    }
  }

  const pRes = [];
  for (let i = 0; i < papers.length; i++) {
    pRes.push(await verifyPaper(papers[i]));
    if (i % 10 === 9) {
      console.log(`papers ${i + 1}/${papers.length}`);
      await sleep(250);
    }
  }

  const videosOk = vRes.filter((v) => v.ok);
  const videosFail = vRes.filter((v) => !v.ok);
  const papersOk = pRes.filter((p) => p.ok);
  const papersFail = pRes.filter((p) => !p.ok);

  writeFileSync(join(dir, "verified-videos.json"), JSON.stringify(videosOk, null, 2));
  writeFileSync(join(dir, "verified-papers.json"), JSON.stringify(papersOk, null, 2));

  console.log(`\nVIDEOS: ${videosOk.length}/${videos.length} verified. Failures:`);
  for (const f of videosFail) console.log(`  - ${f.topicId}: ${f.youtubeId ?? "?"} status=${f.status ?? "?"} ${f.error ?? ""}`);
  console.log(`\nPAPERS: ${papersOk.length}/${papers.length} ok. Failures:`);
  for (const f of papersFail) console.log(`  - ${f.title}: ${f.url} status=${f.status ?? "?"} ${f.error ?? ""}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});