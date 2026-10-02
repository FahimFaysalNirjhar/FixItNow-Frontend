import Link from "next/link";
import { ExternalLink, Tags } from "lucide-react";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { DeleteCategoryButton } from "./DeleteCategoryButton";
import { AdminCategory } from "../../_actions/adminDashboard";

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      })
    : null;

export function CategoriesList({
  categories,
}: {
  categories: AdminCategory[];
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => {
        const count = category._count?.services;
        const added = formatDate(category.createdAt);

        return (
          <li
            key={category.id}
            className="flex flex-col gap-4 rounded-xl border border-[#c9a45c]/30 bg-white p-5"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] text-[#b8892f]">
                <Tags className="size-5" aria-hidden />
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-serif text-lg font-semibold text-[#2c4a6e]">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {count !== undefined &&
                    `${count} service${count === 1 ? "" : "s"}`}
                  {count !== undefined && added && " · "}
                  {added && `Added ${added}`}
                </p>
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-[#c9a45c]/30 pt-3">
              <CategoryFormDialog category={category} />
              <DeleteCategoryButton
                id={category.id}
                name={category.name}
                serviceCount={count}
              />

              <Link
                href={`/services?categoryId=${category.id}`}
                className="ml-auto flex items-center gap-1 font-serif text-xs text-[#b8892f] hover:underline"
              >
                View on site
                <ExternalLink className="size-3" aria-hidden />
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
