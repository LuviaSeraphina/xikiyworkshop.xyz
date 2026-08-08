"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { FriendLink, SiteConfig } from "@/lib/types";
import { Field, PanelCard, PrimaryButton, inputClass } from "./ui";

export default function FriendsPanel({
  initialSite,
}: {
  initialSite: SiteConfig;
}) {
  const [friendsText, setFriendsText] = useState(() =>
    JSON.stringify(initialSite.friends, null, 2)
  );
  const [treasuresText, setTreasuresText] = useState(() =>
    JSON.stringify(initialSite.treasures, null, 2)
  );
  const [saved, setSaved] = useState(false);

  const save = async () => {
    let friends: FriendLink[];
    let treasures: FriendLink[];
    try {
      friends = JSON.parse(friendsText);
      treasures = JSON.parse(treasuresText);
    } catch {
      window.alert("友链 / 宝藏链接的 JSON 格式错误");
      return;
    }

    await fetch("/api/dev/site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friends, treasures }),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="space-y-6">
      <PanelCard title="友情链接">
        <Field label="友情链接 JSON（name / description / url / image）">
          <textarea
            className={`${inputClass} min-h-48 resize-y font-mono text-xs`}
            value={friendsText}
            onChange={(event) => setFriendsText(event.target.value)}
          />
        </Field>
      </PanelCard>

      <PanelCard title="宝藏链接">
        <Field label="宝藏链接 JSON（name / description / url / image）">
          <textarea
            className={`${inputClass} min-h-48 resize-y font-mono text-xs`}
            value={treasuresText}
            onChange={(event) => setTreasuresText(event.target.value)}
          />
        </Field>
      </PanelCard>

      <PrimaryButton onClick={save} className="h-12 px-8">
        <Save className="mr-2 inline h-4 w-4" />
        {saved ? "已保存" : "保存友链配置"}
      </PrimaryButton>
    </div>
  );
}
