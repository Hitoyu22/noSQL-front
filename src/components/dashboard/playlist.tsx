import { cn } from "@/lib/utils";

import { Link } from "react-router-dom";

interface Playlist extends React.HTMLAttributes<HTMLDivElement> {
  playlist: {
    _id: string;
    name: string;
    cover: string;
  };
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function Playlist({
  playlist,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: Playlist) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
        <Link to={`/playlist/${playlist._id}`}>
          <div className="overflow-hidden rounded-md">
            <img
              src={playlist.cover}
              alt={playlist.name}
              width={width}
              height={height}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
              )}
            />
          </div>
        </Link>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{playlist.name}</h3>
      </div>
    </div>
  );
}
