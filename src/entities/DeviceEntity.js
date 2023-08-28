import BaseEntity from './BaseEntity';

class DeviceEntity extends BaseEntity {
	constructor() {
		super();
		this.id = null;
		this.id_device = null;
		this.id_project = null;
		this.id_device_type = null;
		this.name = null;
		this.model = null;
		this.serial_number = null;
		this.manufacturer = null;
		this.installed_at = null;
		this.description = null;
		this.status = 1;
		this.is_virtual = 1;
		this.created_date = null;
		this.created_by = null;
		this.updated_date = null;
		this.updated_by = null;
	}
}
export default DeviceEntity;