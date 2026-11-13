import React, { useEffect, useState } from "react";
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Ripple } from 'primereact/ripple';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { rowsPagination } from "../constants/propGlobal";

const Pagination = ({pageIndex, setPageIndex, pageSize, setPageSize, totalRecords, rowsPerPageOptions = rowsPagination, dropdownAppendTo = "self"}) => {
    const [currentPage, setCurrentPage] = useState(pageIndex);
    const toastRef = useRef(null);
    const resolvedAppendTo = dropdownAppendTo === "body"
        ? (typeof document !== "undefined" ? document.body : null)
        : dropdownAppendTo;

    useEffect(() => {
        setCurrentPage(pageIndex);
    }, [pageIndex]);

    const onPageChange = (e) => {
        setPageIndex(e.page + 1);
        setPageSize(e.rows); 
        
    };

    const onPageInputChange = (event) => {
        setCurrentPage(+event.target.value);
    };

    const onPageInputKeyDown = (event, options) => {
        if (event.key === 'Enter') {
            const page = parseInt(currentPage);
            if (isNaN(page) || page < 1 || page > options.totalPages) {
                toastRef.current?.show({
                    severity: 'warn',
                    summary: 'Lỗi',
                    detail: `Trang phải nằm trong khoảng 1 đến ${options.totalPages}`,
                    life: 2000
                });
            } else {
                setPageIndex(currentPage);
            }
        }
    };

    const customTemplate = {
        layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
        PrevPageLink: (options) => {
            return (
                <button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
                    <i className="pi pi-chevron-left"></i>
                    <Ripple />
                </button>
            );
        },
        NextPageLink: (options) => {
            return (
                <button type="button" className={classNames(options.className, 'border-round')} onClick={options.onClick} disabled={options.disabled}>
                    <i className="pi pi-chevron-right"></i>
                    <Ripple />
                </button>
            );
        },
        PageLinks: (options) => {
            if ((options.view.startPage === options.page && options.view.startPage !== 0) ||
                (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
                const className = classNames(options.className, { 'p-disabled': true });
                return (
                    <span className={className} style={{ userSelect: 'none' }}>
                        ...
                    </span>
                );
            }

            return (
                <button type="button" className={options.className} onClick={options.onClick}>
                    {options.page + 1}
                    <Ripple />
                </button>
            );
        },
        RowsPerPageDropdown: (options) => {
            const dropdownOptions = rowsPerPageOptions.map((value) => ({
                label: value.toString(),
                value
            }));

            return <Dropdown 
                value={options.value} 
                options={dropdownOptions} 
                onChange={options.onChange} 
                appendTo={resolvedAppendTo}
            />;
        },
        CurrentPageReport: (options) => {
            const totalPages = Math.ceil(options.totalRecords / options.rows);
            return (
                <span className="current-page-style" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                    Đến trang
                    <InputText
                        style={{ width: '60px' }}
                        type="number"
                        min={1}
                        className="ml-1"
                        value={currentPage}
                        tooltip="Nhấn 'Enter' để đến trang"
                        onKeyDown={(e) => onPageInputKeyDown(e, options)}
                        onChange={onPageInputChange}
                    /> / {totalPages}
                    {/* &nbsp; ({options.first} - {options.last} of {options.totalRecords}) */}
                    &nbsp; (Tổng bản ghi: {options?.totalRecords?.toLocaleString("vi-VN")})
                </span>
            );
        }
    };

    return (
        <div>
            <Toast ref={toastRef} />

            {totalRecords > 0 && (
                <Paginator
                    template={customTemplate}
                    first={(pageIndex - 1) * pageSize}
                    rows={pageSize}
                    totalRecords={totalRecords}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}

export default Pagination;
