import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ethers, parseEther, Wallet } from "ethers";
import { requireRpcUrlEnv } from "../utils/utils";

export async function triggerWebhook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(JSON.stringify({
    url: request.url,
    method: request.method,
    log: "Begin triggerWebhook function"
  }));

  const addresses = {
    "SEPOLIA": [
      "0xa05e0B8ba1764290cEDFE596C384C1327e6Db50F", // https://app.levain.tech/wallets/6376989c-a5c8-4abb-af19-4fbc95b83563/addresses/6aeb8e00-23f2-44f5-a601-9779d8153c45
      "0xe3a9c22076B167767B0c32FD2ee990048CF33FFD", // https://app.levain.tech/wallets/6376989c-a5c8-4abb-af19-4fbc95b83563/addresses/75e89a83-7c13-49ff-9b83-740dad5a55e2
      "0xa57FA69b8BD3ee5055a7Cc8549f2a3BbAf563011", // https://app.levain.tech/wallets/6376989c-a5c8-4abb-af19-4fbc95b83563/addresses/74365940-df71-45c8-94b7-046d51fb4c46
    ],
    "BSCTESTNET": [
      "0xB2f7f224324089e4B5977faDA9Edd73dBbD0aA46", // https://app.levain.tech/wallets/1210ff2e-d2d2-4f5c-8e33-55e0b086c430/addresses/b85ae70e-d796-4d7a-a98e-47873c9dea5a
      "0xAe67aF40983B3e1EaB8a11c1DC56280868d6d10D", // https://app.levain.tech/wallets/1210ff2e-d2d2-4f5c-8e33-55e0b086c430/addresses/036331f4-6e8e-4f8c-9ed7-c02a032f337c
      "0xe6635D73db05CB13C65039161F646b8020EB8f37", // https://app.levain.tech/wallets/1210ff2e-d2d2-4f5c-8e33-55e0b086c430/addresses/36569efe-a4cd-44e4-9496-1b635a57fad8
    ]
  }

  for (const chain in addresses) {
    const rpcUrl = requireRpcUrlEnv(chain);
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new Wallet(process.env.PRIVATE_KEY_TEST, provider);
    const nonce = await provider.getTransactionCount(signer.address, "latest");

    for (let i = 0; i < addresses[chain].length; i++) {
      const randomValue = "0.005";
      let tx = signer.sendTransaction({
        to: addresses[chain][i],
        value: parseEther(randomValue),
        nonce: nonce + i,
      });

      context.log(JSON.stringify({
        url: request.url,
        method: request.method,
        log: `Transferred ${randomValue} native token to ${addresses[chain][i]} on ${chain} with nonce ${nonce + i}`,
      }));
    }
  }

  return {
    body: JSON.stringify({
      "data": "Completed triggerWebhook",
    }),
  };
};

app.http('triggerWebhook', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: triggerWebhook
});
