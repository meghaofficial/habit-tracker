import { Handle, Position } from "@xyflow/react";
import type { RoadmapNodeData } from "../../../types";

export const RoadmapNode = ({ data }: { data: RoadmapNodeData }) => {
  return (
    <div
      className="w-55 bg-white border shadow-md p-4"
      style={{
        borderLeft: `5px solid ${data.color}`,
      }}
    >
      <Handle type="target" position={Position.Top} />

      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: data.color,
          }}
        />

        <h3 className="font-semibold">{data.title}</h3>
      </div>

      {data.description && (
        <p className="text-sm text-gray-500 mt-2">{data.description}</p>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
