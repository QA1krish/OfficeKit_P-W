import { createServer } from 'node:http';
import { loadConfig } from '../src/automation/config';
import { dispatchWorkflow } from '../src/automation/github/dispatch';
import { FileEventStore, loadTargets, parseInReviewEvent, validSecret } from '../src/automation/webhook/handler';

const config = loadConfig('webhook'); const webhook = config.webhook!; const github = config.github!; const events = new FileEventStore(webhook.eventStore, webhook.ttlMs);
createServer(async (request, response) => {
  if (request.method !== 'POST' || request.url !== '/jira/webhook') { response.writeHead(404).end(); return; }
  if (!validSecret(request.headers['x-webhook-secret'] as string | undefined, webhook.secret)) { response.writeHead(401).end(); return; }
  let claimed: string | undefined;
  try {
    const chunks: Buffer[] = []; let size = 0; for await (const chunk of request) { size += chunk.length; if (size > 1_000_000) throw new Error('Payload too large'); chunks.push(chunk); }
    const event = parseInReviewEvent(JSON.parse(Buffer.concat(chunks).toString('utf8')), webhook.projectKey, await loadTargets(webhook.targetRegistry), webhook.rerunMode, process.env.TEST_ENV ?? 'beta');
    if (!await events.claim(event.eventId)) { response.writeHead(202).end('Duplicate ignored'); return; } claimed = event.eventId;
    await dispatchWorkflow(github, event.inputs);
    try { await events.release(claimed); } catch { /* Release is best-effort after successful dispatch */ }
    response.writeHead(202).end('Verification dispatched');
  } catch (error) { if (claimed) { try { await events.release(claimed); } catch { /* Release is best-effort */ } } console.error(error instanceof Error ? error.message : 'Webhook processing failed'); response.writeHead(500).end('Rejected'); }
}).listen(webhook.port, () => console.log(`Jira webhook listening on port ${webhook.port}`));
