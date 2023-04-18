import { SettingsType, useStore } from "../fastContextStore";

export const Component = ({
  selector,
  settings,
}: {
  selector?: string;
  settings?: SettingsType;
}) => {
  const { getStoreData } = useStore();

  return (
    <div
      style={{
        padding: "10px",
        border: "1px dashed #eee5",
      }}
    >
      <span style={{ color: "green" }}>{selector}</span>
      <pre>{JSON.stringify(getStoreData(selector, settings), null, 4)}</pre>
    </div>
  );
};
