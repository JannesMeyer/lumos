import React from 'react';

var BreadcrumbList = React.createClass({
	handleClick(e) {
		if (e.button === 0) {
			var title = e.target.firstChild.data;
			var path = e.target.pathname;
			navigateTo(path, title);
			e.preventDefault();
		}
	},
	render() {
		return (
			<ol>
				{this.props.breadcrumbs.map(item =>
					<li key={item.path}><a href={item.path} onClick={this.handleClick}>{item.name}</a></li>
				)}
				<li className="more">
					<ol>
						{this.props.dirs.map(item =>
							<li key={item.relative}><a href={item.link} onClick={this.handleClick}>{item.relative}</a></li>
						)}
					</ol>
				</li>
			</ol>
		);
	}
});
export default BreadcrumbList;