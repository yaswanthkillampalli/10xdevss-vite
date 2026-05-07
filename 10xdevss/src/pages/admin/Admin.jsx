import React from 'react';

const Admin = () => {
	return (
		<div style={{padding: 20, fontFamily: 'Arial, sans-serif'}}>
			<h1>Admin Dashboard</h1>
			<p>Welcome to the admin area. This is a simple placeholder page.</p>
			<div style={{marginTop: 16}}>
				<button onClick={() => alert('Action executed')} style={{padding: '8px 12px'}}>
					Run Action
				</button>
			</div>
		</div>
	);
};

export default Admin;
