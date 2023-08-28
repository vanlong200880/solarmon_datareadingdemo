import BaseEntity from './BaseEntity';

class ModelLoggerSMAIM20Entity extends BaseEntity {
	constructor() {
		super();
		this.time = null;
		this.id_device = null;
		this.manufacturer = null;
		this.model = null;
		this.serialNumber = null;
		this.modbusUnitId = null;
	}
}
export default ModelLoggerSMAIM20Entity;