import { Action, ActionPanel, List, Icon, Toast, showToast } from "@raycast/api";
import { useState } from "react";
import { useSearchWord } from "./hooks/searchWord";
import { playSound } from "./playsound";
import { setTimeout } from "timers/promises";
import fetch from "node-fetch";

export default function Command() {
  const [input, setInput] = useState("");
  const { isLoading, result: items } = useSearchWord(input);

  return (
    <List
      isLoading={isLoading}
      searchText={input}
      onSearchTextChange={async (text) => {
        setInput(text);
      }}
    >
      {(items as any[])?.map((item, index) => (
        <List.Item
          actions={
            <ActionPanel title="#1 in raycast/extensions">
              <Action
                title={"PlaySound"}
                icon={Icon.Play}
                shortcut={{ modifiers: ["cmd"], key: "j" }}
                onAction={() => {
                  playSound(`https://dict.youdao.com/dictvoice?audio=${item.entry}&type=1`);
                }}
              />
              <Action
                title="Add To Dictionary"
                icon={Icon.PlusCircle}
                shortcut={{ modifiers: ["cmd"], key: "d" }}
                onAction={async () => {
                  const toast = await showToast({
                    style: Toast.Style.Animated,
                    title: "Adding...",
                  });

                  try {
                    await fetch(`http://localhost:3000/api/english/add?word=${item.entry}`, {
                      headers: { Authorization: "aksdilwp@11OLM&123123JJYoK_#*q0192alkasidpqjkasdU^&^*#" },
                      method: "POST",
                    });
                    toast.style = Toast.Style.Success;
                    toast.title = "Adding to Dic Success";
                  } catch (err) {
                    toast.style = Toast.Style.Failure;
                    toast.title = "Failed to add";
                    if (err instanceof Error) {
                      toast.message = err.message;
                    }
                  }
                }}
              />
              <Action.OpenInBrowser url={`https://www.youdao.com/result?word=${item.entry}&lang=en`} />
              <Action.CopyToClipboard
                title="Copy Pull Request URL"
                content="https://github.com/raycast/extensions/pull/1"
              />
            </ActionPanel>
          }
          key={index}
          title={item.entry}
          subtitle={item.explain}
        />
      ))}
    </List>
  );
}
