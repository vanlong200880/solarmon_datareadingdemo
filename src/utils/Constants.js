var Constants = function () {
}
module.exports = Constants;
Constants.cms_url = {
  home: "https://solarmon.techedge.vn",
  reset_password: "https://solarmon.techedge.vn/reset-password",
  logo: "https://solarmon.techedge.vn/logo.png",
  statics: 'https://datareadings.focustech.vn/uploads/'
};

Constants.static_key = "6UTcKodwS4mSBIZgI9pC11vLfcTobNkz5ivqVVGn0PiC44Hev9w3vGZ4NU1RZqQL";
Constants.auth_mode = {
  VIEW: 0,
  NEW: 1,
  DEL: 2,
  EDIT: 3,
  EXCEL: 4,
  PDF: 5,
  PRINT: 6,
  TRANSLATE: 7,
  APPROVAL: 8
},
  Constants.screen_mode = {
    view: 0,
    insert: 1,
    update: 2
  };
Constants.role = {
  user: 0,
  admin: 1
};
Constants.public_api = [
  "/auth/login",
  "/DataReadings/getDataRaw",
  "/DataReadings/getDataAlarm",
  "/ClientReport/getDataReportMonthEmail",
  "/ClientReport/getDataReportYearEmail",
  "/ClientReport/getDataDailyReportEmail",
  "/BatchJob/runNoCommunication",
  "/BatchJob/resetTodayEnergy",
  "/BatchJob/resetPowerNow",
  "/BatchJob/updatedDevicePlant"
];

Constants.data = {
  max_record: 50,
  max_record_excel: 5000, // 5000
  max_record_pdf: 5000,
  max_record_print: 5000,
  lang_default: 'vi',
  headquarter_default: 0,
  allowImage: ["png", "jpeg", "jpg", "PNG", "JPG", "JPEG"],
  allowVideo: ["mp4", "avi"],
  image_folder: "images/",
  // uploads_patients: "uploads/patients/",
  // uploads_res: "/Volumes/Data/Sources/solars/api/uploads/",
  uploads_res: "/www/wwwroot/datareadings.focustech.vn/api/uploads/",

  uploads_full: "fullxN/",
  uploads_thumbnail: "420x320/",


  format: {
    datetime: "DD/MM/YYYY HH:mm:ss",
    date: "DD/MM/YYYY",
    sql_date: "YYYY-MM-DD",
    sql_datetime: "YYYY-MM-DD HH:mm:ss",
    numeric: "#,###.##"
    // numeric: {
    //   "negativeType": 'left',
    //   "prefix": '',
    //   "suffix": '',
    //   "integerSeparator": ',',
    //   "decimalsSeparator": '',
    //   "decimal": '.',
    //   "padLeft": -1
    // }
  }
};
Constants.tables_name = {
  alert: 'alert',
  alert_state: "alert_state",
  alert_state_detail: "alert_state_detail",
  device: "device",
  device_group: "device_group",
  device_parameter: "device_parameter",
  device_type: "device_type",
  device_type_detail: "device_type_detail",
  emloyee_project_map: "emloyee_project_map",
  employee: "employee",
  employee_role_map: "employee_role_map",
  energy_expectations: "energy_expectations",
  error: "error",
  error_detail: "error_detail",
  error_level: "error_level",
  error_level_detail: "error_level_detail",
  error_state: "error_state",
  error_state_detail: "error_state_detail",
  error_type: "error_type",
  error_type_detail: "error_type_detail",
  language: "language",
  mail_receive_config: "mail_receive_config",
  model_emeter_Janitza_UMG96S2: "model_emeter_Janitza_UMG96S2",
  model_inverter_ABB_PVS100: "model_inverter_ABB_PVS100",
  model_inverter_Growatt_GW80KTL3: "model_inverter_Growatt_GW80KTL3",
  model_inverter_SMA_SHP75: "model_inverter_SMA_SHP75",
  model_inverter_SMA_STP50: "model_inverter_SMA_STP50",
  model_inverter_SMA_STP110: "model_inverter_SMA_STP110",
  model_inverter_Sungrow_SG110CX: "model_inverter_Sungrow_SG110CX",
  model_logger_SMA_IM20: "model_logger_SMA_IM20",
  model_sensor_IMT_SiRS485: "model_sensor_IMT_SiRS485",
  model_sensor_IMT_TaRS485: "model_sensor_IMT_TaRS485",
  model_sensor_RT1: "model_sensor_RT1",
  model_techedge: "model_techedge",
  proejct_energy_expectations: "proejct_energy_expectations",
  project: "project",
  project_config: "project_config",
  project_detail: "project_detail",
  project_group: "project_group",
  project_group_detail: "project_group_detail",
  project_map_device_virtual: "project_map_device_virtual",
  role: "role",
  role_detail: "role_detail",
  role_screen_map: "role_screen_map",
  screen: "screen",
  screen_detail: "screen_detail",
};



Constants.type_log = {
  login: 1,
  request: 2,
  insert: 3,
  update: 4,
  delete: 5,
  export: 6,
  print: 7
  // insert: "0",
  // update: "1",
  // delete: "2"
};

Constants.elastic_type = {
  code: "elas_code",
  receive: "elas_receive",
  exam_session: "elas_exam_session",
  // inspect_waiting: "elas_patient_waiting",
  patient_receive: "elas_patient_receive",
  patient_waiting: "elas_patient_waiting",
  invoice_other: "elas_invoice_other",
  permission_cache: "permission_cache"
};

Constants.is_active = {
  inactive: 0,
  active: 1
}

Constants.gender = {
  male: 1,
  female: 2,
  unknown: 3
}

Constants.print_orientation = {
  Landscape: "Landscape",//ngang
  Portrait: "Portrait",//dọc
}
Constants.reg_string_assign = /\$\{([^{}]*?)\}/g;
Constants.reg_exp_number_dot_comma = /^[0-9]{1,3}([.]([\0]?|[0-9]{1,2}))?$/;
Constants.round_number = 2;

Constants.setting = {
  charge_type: 'charge_type',
  file_path: 'file_path'
}

Constants.common_excel_cell_style = {
  thead: {
    font: {
      name: "Arial",
      sz: 12
    },
    alignment: {
      // horizontal: "center"
    },
    border: {
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    }
  },
  header: {
    font: {
      name: "Arial",
      sz: 18,
      bold: true,
      underline: false
    },
    border: {
      sz: 0
    },
    alignment: {
      vertical: "center",
      horizontal: "center"
    }
  },
  bottom_header: {
    font: {
      name: "Arial",
      sz: 14,
      bold: false,
      underline: false
    },
    border: {
      sz: 0
    },
    alignment: {
      vertical: "center",
      horizontal: "center"
    }
  },
  left_header: {
    font: {
      name: "Arial",
      sz: 14,
      bold: false,
      underline: false
    },
    border: {
      sz: 0
    },
    alignment: {
      vertical: "left",
      horizontal: "left"
    }
  },
  theader: {
    font: {
      name: "Arial",
      sz: 14,
      bold: true,
      underline: false
    },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
    alignment: {
      vertical: "center",
      horizontal: "center"
    }
  },
  tbody: {
    font: {
      name: "Arial",
      sz: 12
    },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    }
  }
};

Constants.format_system_code = {
  NUMBER: "number",
  DATE: "date",
  PREFIX: "prefix"
};
Constants.full_formant_system_code = {
  NUM_TRANSFER: (Constants.format_system_code.NUMBER + "/" + Constants.format_system_code.DATE + "/" + Constants.format_system_code.PREFIX)
}
