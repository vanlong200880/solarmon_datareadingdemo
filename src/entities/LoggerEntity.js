import BaseEntity from './BaseEntity';

class LoggerEntity extends BaseEntity {
	constructor() {
		super();
		this.id = null;
		this.table_name = null;
		this.type = null;
		this.user_id = null;
		this.content = null;
	}
}

export default LoggerEntity;