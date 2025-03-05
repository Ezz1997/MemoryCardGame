import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const seconds_num = [20, 30, 40, 50];

export default function BasicSelect({ seconds, setSeconds }) {
  const handleChange = (event) => {
    setSeconds(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="simple-select-label">Seconds</InputLabel>
        <Select
          labelId="simple-select-label"
          id="simple-select"
          value={seconds}
          label="Seconds"
          onChange={handleChange}
          //   disabled={seconds}
        >
          {seconds_num.map((s, index) => {
            return (
              <MenuItem key={index} value={s}>
                {s}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
