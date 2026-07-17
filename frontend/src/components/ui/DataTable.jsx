import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const DataTable = ({ columns, data, searchable = true, searchPlaceholder = "Search...", actions = null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Simple string-based filter across all object values
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage, 
    currentPage * rowsPerPage
  );

  return (
    <div className="w-full bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/[0.01]">
        {searchable ? (
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-textMuted" />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to page 1 on search
              }}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-3 py-2 text-sm text-white placeholder-textMuted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
            />
          </div>
        ) : <div />}
        
        {actions && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {actions}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-6 py-4 bg-white/[0.02] text-xs font-semibold text-textMuted uppercase tracking-wider sticky top-0 z-10 border-b border-border ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-white/[0.01] transition-colors group">
                  {columns.map((col, colIdx) => (
                    <td 
                      key={colIdx} 
                      className={`px-6 py-4 whitespace-nowrap text-sm text-text ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-textMuted">
                  No data found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-white/[0.01]">
        <div className="text-sm text-textMuted">
          Showing <span className="font-medium text-white">{filteredData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * rowsPerPage, filteredData.length)}</span> of <span className="font-medium text-white">{filteredData.length}</span> results
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded border border-border bg-background text-textMuted hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-white min-w-[2rem] text-center">
            {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 rounded border border-border bg-background text-textMuted hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
