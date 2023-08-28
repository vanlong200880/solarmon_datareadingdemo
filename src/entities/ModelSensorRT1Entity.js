import BaseEntity from './BaseEntity';

class ModelSensorRT1Entity extends BaseEntity {
	constructor() {
		super();
		this.time = null;
		this.id_device = null;
		this.deviceType = null;
		this.dataModel = null;
		this.softwareVersion = null;
		this.hardwareVersion = null;
		this.batchNumber = null;
		this.serialNumber = null;
		this.modbusUnitID = null;
		this.sensor1Data = null;
		this.internalTemperature = null;
		this.externalVoltage = null;
	}
}
export default ModelSensorRT1Entity;