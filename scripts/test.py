def create_instance(self, body, project_id=None):
    response = self.get_conn().instances().insert(
        project=project_id,
        body=body
    ).execute(num_retries=self.num_retries)
    operation_name = response['name']
    self.wait_for_operation_to_complete( project_id=project_id, operation_name=operation_name)