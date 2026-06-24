import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { ChevronDown, Check } from "lucide-react";

/**
 * CustomSelect - Refactored to use MUI Select
 */
const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  disabled = false,
}) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const currentOption = options.find((opt) =>
    typeof opt === "string" ? opt === value : opt.value === value
  );

  return (
    <FormControl
      disabled={disabled}
      className={className}
      sx={{
        minWidth: 150,
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          backgroundColor: '#fafafa',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#fff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ff6f61',
            },
          },
          '&.Mui-focused': {
            backgroundColor: '#fff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ff6f61',
              borderWidth: '2px',
            },
          },
        },
      }}
    >
      <Select
        value={value || ""}
        onChange={handleChange}
        displayEmpty
        renderValue={() => {
          if (!value) {
            return (
              <Typography sx={{ color: '#666' }}>{placeholder}</Typography>
            );
          }
          if (currentOption) {
            const optLabel = typeof currentOption === "string" ? currentOption : currentOption.label;
            const optIcon = typeof currentOption === "string" ? null : currentOption.icon;
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {optIcon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{optIcon}</Box>}
                <Typography>{optLabel}</Typography>
              </Box>
            );
          }
          return value;
        }}
        IconComponent={() => <ChevronDown size={18} style={{ marginRight: '10px' }} />}
      >
        {options.map((option, index) => {
          const optValue = typeof option === "string" ? option : option.value;
          const optLabel = typeof option === "string" ? option : option.label;
          const optIcon = typeof option === "string" ? null : option.icon;
          const isSelected = optValue === value;

          return (
            <MenuItem
              key={index}
              value={optValue}
              sx={{
                borderRadius: '8px',
                mx: 1,
                my: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 111, 97, 0.1)',
                  color: '#ff6f61',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 111, 97, 0.2)',
                  },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {optIcon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{optIcon}</Box>}
                  <Box>{optLabel}</Box>
                </Box>
                {isSelected && <Check size={14} color="#ff6f61" />}
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
