import BaseEntity from './BaseEntity';

class AlertEntity extends BaseEntity {
	constructor() {
		super();
		this.id = null;
		this.id_device = null;
		this.id_error = null;
		this.start_date = null;
		this.end_date = null;
		this.note = null;
		this.id_alert_state = null;
		this.status = null;
		this.created_date = null;
		this.created_by = null;
		this.updated_date = null;
		this.updated_by = null;
	}
}
export default AlertEntity;