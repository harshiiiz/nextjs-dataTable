"use client";

import { useEffect, useState } from "react";
import { fetchLocations, createLocation, updateLocation, deleteLocation } from "../services/api";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, TablePagination, Checkbox, FormControlLabel
} from "@mui/material";

export default function DataTable() {
  const [data, setData] = useState([]);
  const [newEntry, setNewEntry] = useState({ name: "", city: "", country: "" });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [columns, setColumns] = useState({
    name: true,
    city: true,
    country: true,
    lastUpdated: true
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchLocations({ search, sort, order, page: page + 1, limit: rowsPerPage });
        console.log("API Response:", response); // Debugging output
        console.log("Data type:", typeof response.data);
        console.log("Is Array?", Array.isArray(response.data));
        setData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      }
    };
    loadData();
  }, [search, sort, order, page, rowsPerPage]);
  

  const loadData = async () => {
    const response = await fetchLocations({
      search,
      sort,
      order,
      page: page + 1,
      limit: rowsPerPage
    });
    console.log(response);
    setData(response.data);
    setTotalRows(response.total);
  };

  const handleDelete = async (id) => {
    console.log("Attempting to delete ID:", id); 
    await deleteLocation(id);
    loadData(); 
  };
  
  const handleCreate = async () => {
    if (newEntry.name && newEntry.city && newEntry.country) {
      const newItem = { ...newEntry, lastUpdated: new Date().toISOString() };
      await createLocation(newItem);
      setNewEntry({ name: "", city: "", country: "" });
      loadData();
    }
  };

  const handleSort = (column) => {
    if (sort === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(column);
      setOrder("asc");
    }
  };

  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      <FormControl style={{ marginLeft: "10px", marginBottom: "10px" }}>
        <InputLabel>Sort By</InputLabel>
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="city">City</MenuItem>
          <MenuItem value="country">Country</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={<Checkbox checked={columns.name} onChange={() => setColumns({ ...columns, name: !columns.name })} />}
        label="Name"
      />
      <FormControlLabel
        control={<Checkbox checked={columns.city} onChange={() => setColumns({ ...columns, city: !columns.city })} />}
        label="City"
      />
      <FormControlLabel
        control={<Checkbox checked={columns.country} onChange={() => setColumns({ ...columns, country: !columns.country })} />}
        label="Country"
      />
      <FormControlLabel
        control={<Checkbox checked={columns.lastUpdated} onChange={() => setColumns({ ...columns, lastUpdated: !columns.lastUpdated })} />}
        label="Last Updated"
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.name && <TableCell onClick={() => handleSort("name")}>Name</TableCell>}
              {columns.city && <TableCell onClick={() => handleSort("city")}>City</TableCell>}
              {columns.country && <TableCell onClick={() => handleSort("country")}>Country</TableCell>}
              {columns.lastUpdated && <TableCell>Last Updated</TableCell>}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.name && <TableCell>{row.name}</TableCell>}
                {columns.city && <TableCell>{row.city}</TableCell>}
                {columns.country && <TableCell>{row.country}</TableCell>}
                {columns.lastUpdated && <TableCell>{new Date(row.lastUpdated).toLocaleString()}</TableCell>}
                <TableCell>
                  <Button color="secondary" onClick={() => handleDelete(row.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell><TextField label="Name" value={newEntry.name} onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })} /></TableCell>
              <TableCell><TextField label="City" value={newEntry.city} onChange={(e) => setNewEntry({ ...newEntry, city: e.target.value })} /></TableCell>
              <TableCell><TextField label="Country" value={newEntry.country} onChange={(e) => setNewEntry({ ...newEntry, country: e.target.value })} /></TableCell>
              <TableCell>-</TableCell>
              <TableCell><Button color="primary" onClick={handleCreate}>Add</Button></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalRows}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />
    </div>
  );
}
