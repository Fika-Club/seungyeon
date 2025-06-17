/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useMemo, useState } from 'react';

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, string | number | JSX.Element>[];
  sortable?: boolean;
  pagination?: {
    pageSize: number;
  };
  selectable?: boolean;
}

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  background-color: #ffffff;
`;

const StyledTable = styled.table`
  width: 100%;
  border-spacing: 0;  font-size: 14px;
`;

const Th = styled.th<{ width?: string; clickable?: boolean }>`
  position: sticky;
  top: 0;
  background-color: #f3f4f6;
  padding: 14px 16px;
  text-align: left;
  font-weight: 700;
  color: #1f2937;
  border-bottom: 1px solid #d1d5db;
  ${({ width }) => width && `width: ${width};`}
  ${({ clickable }) => clickable && `cursor: pointer;`}
`;

const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #374151;
  vertical-align: middle;

  // Ensure inline components like Toast render correctly
  > div {
    display: block;
    max-width: 100%;
  }
`;

const Tr = styled.tr`
  &:nth-of-type(even) {
    background-color: #f9fafb;
  }

  &:hover {
    background-color: #f3f4f6;
  }
`;

const Checkbox = styled.input`
  display: block;
  margin: 0 auto;
`;

interface ToastProps {
  variant: 'warning' | 'info' | 'error' | 'success';
  message: string;
  onClose: () => void;
}

const Toast = ({ variant, message, onClose }: ToastProps) => {
  const bgColor = {
    warning: '#fef3c7',
    info: '#dbeafe',
    error: '#fee2e2',
    success: '#d1fae5',
  }[variant];

  const textColor = {
    warning: '#b45309',
    info: '#2563eb',
    error: '#b91c1c',
    success: '#065f46',
  }[variant];

  return (
    <div
      css={css`
        background-color: ${bgColor};
        color: ${textColor};
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 250px;
        box-sizing: border-box;
      `}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        css={css`
          background: none;
          border: none;
          font-weight: bold;
          cursor: pointer;
          color: ${textColor};
          margin-left: 8px;
        `}
      >
        ×
      </button>
    </div>
  );
};

export const DataTable = ({
  columns,
  data,
  sortable = false,
  pagination,
  selectable = false,
}: DataTableProps) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedData = useMemo(() => {
    if (!sortable || !sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey] as string | number | JSX.Element;
      const bVal = b[sortKey] as string | number | JSX.Element;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      // If values are JSX or mixed types, skip sorting or convert to string
      return sortAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, sortAsc, sortable]);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pagination.pageSize;
    return sortedData.slice(start, start + pagination.pageSize);
  }, [sortedData, pagination, currentPage]);

  const pageCount = pagination
    ? Math.ceil(data.length / pagination.pageSize)
    : 1;

  const toggleRow = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <>
      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              {selectable && <Th width="40px"><Checkbox type="checkbox" disabled /></Th>}
              {columns.map((col) => (
                <Th
                  key={col.key}
                  width={col.width}
                  onClick={() => sortable && handleSort(col.key)}
                  clickable={sortable}
                >
                  {col.label}
                  {sortable && sortKey === col.key && (sortAsc ? ' ▲' : ' ▼')}
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIdx) => (
              <Tr key={rowIdx}>
                {selectable && (
                  <Td>
                    <Checkbox
                      type="checkbox"
                      checked={selectedRows.includes(rowIdx)}
                      onChange={() => toggleRow(rowIdx)}
                    />
                  </Td>
                )}
                {columns.map((col) => (
                  <Td key={col.key}>{row[col.key]}</Td>
                ))}
              </Tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
      {pagination && (
        <div css={css`
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
        `}>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              css={css`
                padding: 6px 12px;
                min-width: 36px;
                border: 1px solid #d1d5db;
                background: ${i + 1 === currentPage ? '#3b82f6' : '#ffffff'};
                color: ${i + 1 === currentPage ? '#ffffff' : '#1f2937'};
                font-weight: 500;
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.2s;
                &:hover {
                  background: ${i + 1 === currentPage ? '#2563eb' : '#f3f4f6'};
                }
              `}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
};