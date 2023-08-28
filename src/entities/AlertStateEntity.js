import BaseEntity from './BaseEntity';

class AlertStateEntity extends BaseEntity {
	constructor() {
		super();
		this.id = null;
		this.status = 1;
		this.created_date = null;
		this.created_by = null;
		this.updated_date = null;
		this.updated_by = null;
	}
}
export default AlertStateEntity;