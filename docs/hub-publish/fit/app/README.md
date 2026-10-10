# Fit

Fit reads the computer it is running on and recommends an open-source language model that actually fits. The page leads with one model, plus the three numbers that matter: context length, tokens per second, and memory.

Run it on your own machine and the scan reads that machine's processor, memory, graphics card, and free disk.

The public site cannot see those numbers. A hosted page would otherwise report the hosting machine. Fit instead reads the graphics card and processor threads the browser is allowed to share, then offers a one-line local helper for exact memory, VRAM, free disk, and Ollama:

```bash
curl -fsSL https://fit-llm.vercel.app/fit-scan.mjs | node
```

Leave that process running and return to the page. It listens only on `127.0.0.1`.

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:41731](http://127.0.0.1:41731).

```bash
npm test
npm run lint
```

## How a recommendation is chosen

1. Usable memory is graphics memory when a dedicated GPU is present. Apple silicon uses a share of unified memory. Otherwise the model runs in system RAM, with a few gigabytes left for the operating system.
2. A model fits only when its 4-bit weights, the KV cache for the context window, and a little runtime overhead all stay inside that memory with headroom. A longer window is kept when it still fits, because decode speed barely changes while the window stays on the fast device.
3. Tokens per second come from memory bandwidth. One generated token has to touch every weight, so the estimate is bandwidth times efficiency, divided by the working set, with a small fixed overhead.
4. Among models that fit, the score mixes quality for the chosen task, speed, and context length. “Fast replies”, “Balanced”, and “Best quality” only change those weights.

The catalog is open-weight models that Ollama can pull. Numbers are engineering estimates, not a live benchmark on your machine.
