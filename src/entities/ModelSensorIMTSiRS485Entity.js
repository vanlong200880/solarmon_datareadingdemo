import BaseEntity from './BaseEntity';

class ModelSensorIMTSiRS485Entity extends BaseEntity {
	constructor() {
		super();
		this.time = null;
		this.id_device = null;
		this.irradiancePoA = null;
		this.cellTemp = null;
		this.panelTemp = null;
	}
}
export default ModelSensorIMTSiRS485Entity;