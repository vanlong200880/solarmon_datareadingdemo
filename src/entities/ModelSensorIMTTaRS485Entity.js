import BaseEntity from './BaseEntity';

class ModelSensorIMTTaRS485Entity extends BaseEntity {
	constructor() {
		super();
		this.time = null;
		this.id_device = null;
		this.ambientTemp = null;
	}
}
export default ModelSensorIMTTaRS485Entity;