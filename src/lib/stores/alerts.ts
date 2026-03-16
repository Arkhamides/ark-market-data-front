import { writable } from "svelte/store";

export interface Alert {
  id?: string;
  type?: string;
  symbol?: string;
  price?: number;
  threshold?: number;
  percent_change?: number;
  direction?: string;
  triggered?: boolean;
  triggered_at?: number | null;
  created_at?: number;
  label?: string;
  [key: string]: unknown;
}

function createAlertsStore() {
  const { subscribe, set, update } = writable<Alert[]>([]);

  return {
    subscribe,
    set,
    update,
    refresh: async () => {
      try {
        const response = await fetch("/api/tools/call", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toolName: "get_alerts",
            arguments: {},
          }),
        });

        const data = await response.json();
        console.log("Alerts API response:", data);

        if (data.content && Array.isArray(data.content)) {
          const contentItem = data.content[0];
          let alertsList: Alert[] = [];

          // Handle text response with embedded JSON
          if (contentItem.type === "text" && contentItem.text) {
            try {
              // Extract JSON array from the text (starts with [ and ends with ])
              const textContent = contentItem.text;
              const jsonMatch = textContent.match(/\[[\s\S]*\]/);
              if (jsonMatch) {
                alertsList = JSON.parse(jsonMatch[0]);
              }
            } catch (parseError) {
              console.error("Failed to parse JSON from text:", parseError);
            }
          } else if (Array.isArray(contentItem)) {
            alertsList = contentItem;
          } else if (contentItem.alerts && Array.isArray(contentItem.alerts)) {
            alertsList = contentItem.alerts;
          }

          console.log("Parsed alerts:", alertsList);
          set(alertsList);
        } else {
          console.log("No content in response");
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    },
  };
}

export const alertsStore = createAlertsStore();
