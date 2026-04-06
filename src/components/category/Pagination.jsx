import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };
  if (totalPages <= 1) return null;
  return <section className="w-full px-6 py-8">
      <div className="flex justify-center items-center gap-2">
        <Button
    variant="ghost"
    size="sm"
    className="p-2 hover:bg-transparent hover:opacity-50 disabled:opacity-30"
    disabled={currentPage === 1}
    onClick={() => onPageChange(currentPage - 1)}
  >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => typeof page === "number" ? <Button
    key={index}
    variant="ghost"
    size="sm"
    className={`min-w-8 h-8 hover:bg-transparent hover:underline text-sm ${currentPage === page ? "font-medium underline" : "font-light"}`}
    onClick={() => onPageChange(page)}
  >
                {page}
              </Button> : <span key={index} className="mx-2 text-sm font-light text-muted-foreground">{page}</span>)}
        </div>

        <Button
    variant="ghost"
    size="sm"
    className="p-2 hover:bg-transparent hover:opacity-50 disabled:opacity-30"
    disabled={currentPage === totalPages}
    onClick={() => onPageChange(currentPage + 1)}
  >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>;
};
var stdin_default = Pagination;
export {
  stdin_default as default
};
