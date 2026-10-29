import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Table = ({
  columns,
  data,
  onRowClick,
  isLoading = false,
  isEmpty = false,
  emptyState,
  pagination = true,
  pageSize = 10,
  selectable = false,
  onSelectRows,
  rowClassName,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;

  let sortedData = [...data];
  if (sortConfig) {
    sortedData.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleSort = (key) => {
    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, i) => startIndex + i)));
    }

    const nextSelectedIndexes =
      selectedRows.size === paginatedData.length ? [] : paginatedData.map((_, i) => startIndex + i);
    onSelectRows?.(nextSelectedIndexes.map((index) => sortedData[index]));
  };

  const handleSelectRow = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
    onSelectRows?.(Array.from(newSelected).map((rowIndex) => sortedData[rowIndex]));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isEmpty || data.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        {emptyState ? (
          emptyState
        ) : (
          <>
            <p className="text-surface-500 dark:text-surface-400">No data found</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm hover:shadow-md transition-shadow">
        <table className="w-full text-sm">
          <thead className="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-700 sticky top-0">
            <tr>
              {selectable && (
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded accent-admin-primary-600 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left font-semibold text-surface-800 dark:text-surface-200 cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700/50 transition-colors"
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable !== false && (
                      <div className="flex flex-col">
                        <ChevronUp
                          size={14}
                          className={`transition-opacity ${
                            sortConfig?.key === column.key && sortConfig.direction === 'asc'
                              ? 'opacity-100 text-admin-primary-600'
                              : 'opacity-30'
                          }`}
                        />
                        <ChevronDown
                          size={14}
                          className={`-mt-1 transition-opacity ${
                            sortConfig?.key === column.key && sortConfig.direction === 'desc'
                              ? 'opacity-100 text-admin-primary-600'
                              : 'opacity-30'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row, index)}
                className={`border-b border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors group cursor-pointer ${typeof rowClassName === 'function' ? rowClassName(row, index) : rowClassName || ''}`}
              >
                {selectable && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(startIndex + index)}
                      onChange={() => handleSelectRow(startIndex + index)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded accent-admin-primary-600 cursor-pointer"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-surface-600 dark:text-surface-300">
                    {column.render ? column.render(row, row[column.key]) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-surface-50 dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-800">
          <div className="text-sm text-surface-600 dark:text-surface-400">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronLeft}
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            />
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-8 h-8 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === i
                      ? 'bg-admin-primary-600 text-white shadow-lg shadow-admin-primary-500/20'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronRight}
              disabled={currentPage === totalPages - 1}
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
