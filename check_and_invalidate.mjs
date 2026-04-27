import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { CloudFrontClient, ListDistributionsCommand, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

const s3 = new S3Client({ region: "us-east-1" });
const cf = new CloudFrontClient({ region: "us-east-1" });

const files = ["shield_lastframe_v2.webp", "staticinsureitlogo_v2.webp"];
console.log("=== S3 actual ETags ===");
for (const f of files) {
  const h = await s3.send(new HeadObjectCommand({ Bucket: "insure-it", Key: `image-assets/${f}` }));
  console.log(`${f}: etag=${h.ETag} size=${h.ContentLength} cache=${h.CacheControl}`);
}

const dists = await cf.send(new ListDistributionsCommand({}));
const target = (dists.DistributionList?.Items ?? []).find(d =>
  (d.Aliases?.Items ?? []).includes("d3gkfgi9drj9kb.cloudfront.net") ||
  d.DomainName === "d3gkfgi9drj9kb.cloudfront.net"
);
console.log("\nDistribution:", target?.Id, target?.DomainName);

if (target?.Id) {
  const inv = await cf.send(new CreateInvalidationCommand({
    DistributionId: target.Id,
    InvalidationBatch: {
      CallerReference: `cli-${Date.now()}`,
      Paths: { Quantity: 5, Items: [
        "/image-assets/shield_lastframe_v2.webp",
        "/image-assets/staticinsureitlogo_v2.webp",
        "/image-assets/heroimage1.webp",
        "/image-assets/heroimage_mobile_v5.webp",
        "/image-assets/team_highfive.webp",
      ]},
    },
  }));
  console.log("Invalidation:", inv.Invalidation?.Id, inv.Invalidation?.Status);
}
