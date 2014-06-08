/** @jsx React.DOM */

var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

var data = { baseDirName: 'Notes',
  breadcrumbs: [ { name: 'Notes', path: '/', isActive: false } ],
  title: 'Google',
  filePath: '/Users/jannes/Dropbox/Notes/Google.md',
  content: '<h1 id="list-of-google-searches-to-carry-out">List of Google searches to carry out</h1>\n<ul>\n<li>Konkurrenz von Mobilinga<ul>\n<li>Repetico</li>\n<li><a href="http://www.phase-6.com/">Phase 6</a></li>\n<li><a href="http://babbel.com/">Babbel</a></li>\n</ul>\n</li>\n<li>OmniFocus 2</li>\n</ul>\n',
  creationDate: '24.05.2014',
  creationTime: '',
  items:
   [ { absolute: '/Users/jannes/Dropbox/Notes/Bookmarks.md',
       relative: 'Bookmarks.md',
       name: 'Bookmarks',
       link: 'Bookmarks',
       isActive: false },
     { absolute: '/Users/jannes/Dropbox/Notes/Find launch items.md',
       relative: 'Find launch items.md',
       name: 'Find launch items',
       link: 'Find%20launch%20items',
       isActive: false },
     { absolute: '/Users/jannes/Dropbox/Notes/Finds.md',
       relative: 'Finds.md',
       name: 'Finds',
       link: 'Finds',
       isActive: false },
     { absolute: '/Users/jannes/Dropbox/Notes/Google.md',
       relative: 'Google.md',
       name: 'Google',
       link: '.',
       isActive: true },
     { absolute: '/Users/jannes/Dropbox/Notes/Lumos.md',
       relative: 'Lumos.md',
       name: 'Lumos',
       link: 'Lumos',
       isActive: false },
     { absolute: '/Users/jannes/Dropbox/Notes/OSX TODO.md',
       relative: 'OSX TODO.md',
       name: 'OSX TODO',
       link: 'OSX%20TODO',
       isActive: false },
     { absolute: '/Users/jannes/Dropbox/Notes/Snippets.md',
       relative: 'Snippets.md',
       name: 'Snippets',
       link: 'Snippets',
       isActive: false },
     { absolute: '/Users/jannes/Dropbox/Notes/TabAttack.md',
       relative: 'TabAttack.md',
       name: 'TabAttack',
       link: 'TabAttack',
       isActive: false },
     { absolute: '/Users/jannes/Dropbox/Notes/TV and Movies.md',
       relative: 'TV and Movies.md',
       name: 'TV and Movies',
       link: 'TV%20and%20Movies',
       isActive: false } ],
  dirs:
   [ { absolute: '/Users/jannes/Dropbox/Notes/Archive',
       relative: 'Archive',
       link: 'Archive/' },
     { absolute: '/Users/jannes/Dropbox/Notes/Computer',
       relative: 'Computer',
       link: 'Computer/' },
     { absolute: '/Users/jannes/Dropbox/Notes/GTD',
       relative: 'GTD',
       link: 'GTD/' },
     { absolute: '/Users/jannes/Dropbox/Notes/Learning',
       relative: 'Learning',
       link: 'Learning/' },
     { absolute: '/Users/jannes/Dropbox/Notes/Material',
       relative: 'Material',
       link: 'Material/' },
     { absolute: '/Users/jannes/Dropbox/Notes/Programming',
       relative: 'Programming',
       link: 'Programming/' },
     { absolute: '/Users/jannes/Dropbox/Notes/Tagebuch',
       relative: 'Tagebuch',
       link: 'Tagebuch/' },
     { absolute: '/Users/jannes/Dropbox/Notes/Temporary',
       relative: 'Temporary',
       link: 'Temporary/' } ],
  prevItem:
   { absolute: '/Users/jannes/Dropbox/Notes/Finds.md',
     relative: 'Finds.md',
     link: 'Finds' },
  nextItem:
   { absolute: '/Users/jannes/Dropbox/Notes/Lumos.md',
     relative: 'Lumos.md',
     link: 'Lumos' } };







/** @jsx React.DOM */

var ProductCategoryRow = React.createClass({displayName: 'ProductCategoryRow',
    render: function() {
        return (React.DOM.tr(null, React.DOM.th( {colSpan:"2"}, this.props.category)));
    }
});

var ProductRow = React.createClass({displayName: 'ProductRow',
    render: function() {
        var name = this.props.product.stocked ?
            this.props.product.name :
            React.DOM.span( {style:{color: 'red'}}, 
                this.props.product.name
            );
        return (
            React.DOM.tr(null, 
                React.DOM.td(null, name),
                React.DOM.td(null, this.props.product.price)
            )
        );
    }
});

var ProductTable = React.createClass({displayName: 'ProductTable',
    render: function() {
        console.log(this.props);
        var rows = [];
        var lastCategory = null;
        this.props.products.forEach(function(product) {
            if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
                return;
            }
            if (product.category !== lastCategory) {
                rows.push(ProductCategoryRow( {category:product.category, key:product.category} ));
            }
            rows.push(ProductRow( {product:product, key:product.name} ));
            lastCategory = product.category;
        }.bind(this));
        return (
            React.DOM.table(null, 
                React.DOM.thead(null, 
                    React.DOM.tr(null, 
                        React.DOM.th(null, "Name"),
                        React.DOM.th(null, "Price")
                    )
                ),
                React.DOM.tbody(null, rows)
            )
        );
    }
});

var SearchBar = React.createClass({displayName: 'SearchBar',
    handleChange: function() {
        this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value,
            this.refs.inStockOnlyInput.getDOMNode().checked
        );
    },
    render: function() {
        return (
            React.DOM.form(null, 
                React.DOM.input(
                    {type:"text",
                    placeholder:"Search...",
                    value:this.props.filterText,
                    ref:"filterTextInput",
                    onChange:this.handleChange}
                ),
                React.DOM.p(null, 
                    React.DOM.input(
                        {type:"checkbox",
                        value:this.props.inStockOnly,
                        ref:"inStockOnlyInput",
                        onChange:this.handleChange}
                    ),
                    "Only show products in stock"
                )
            )
        );
    }
});

var FilterableProductTable = React.createClass({displayName: 'FilterableProductTable',
    getInitialState: function() {
        return {
            filterText: '',
            inStockOnly: false
        };
    },

    handleUserInput: function(filterText, inStockOnly) {
        this.setState({
            filterText: filterText,
            inStockOnly: inStockOnly
        });
    },

    render: function() {
        return (
            React.DOM.div(null, 
                SearchBar(
                    {filterText:this.state.filterText,
                    inStockOnly:this.state.inStockOnly,
                    onUserInput:this.handleUserInput}
                ),
                ProductTable(
                    {products:this.props.products,
                    filterText:this.state.filterText,
                    inStockOnly:this.state.inStockOnly}
                )
            )
        );
    }
});

React.renderComponent(FilterableProductTable( {products:PRODUCTS} ), document.body);


/*
<div class="m-container s-apple">

	<header class="m-header">
		<ol>

			<li><a href="/">Notes</a></li>


			<li class="more">
			<ol>
				<li><a href="Archive/">Archive</a></li><li><a href="Computer/">Computer</a></li><li><a href="GTD/">GTD</a></li><li><a href="Learning/">Learning</a></li><li><a href="Material/">Material</a></li><li><a href="Programming/">Programming</a></li><li><a href="Tagebuch/">Tagebuch</a></li><li><a href="Temporary/">Temporary</a></li>
			</ol>
			</li>

		</ol>
		<form method="get">
		<input type="text" name="q" class="m-search" autocomplete="off" spellcheck="false" dir="auto">
		</form>
	</header>

	<div>
		<section role="content" class="m-page">
		<div class="m-page-buttons">
	<a href="lumos-connect:///Users/jannes/Dropbox/Notes/Google.md" title="Edit page (E)" class="edit-button"><span class="glyphicon glyphicon-pencil"></span></a><a href="" title="Toggle fullscreen (F)" class="button-fullscreen"><span class="glyphicon glyphicon-resize-full"></span></a>
	<!-- TODO: the second button should be added by JavaScript -->
</div>

<div class="m-page-title">

	<h1 class="title">Google</h1>
	<p><span class="date">24.05.2014</span><span class="time"></span></p>

</div>


<article><h1 id="list-of-google-searches-to-carry-out">List of Google searches to carry out</h1>
<ul>
<li>Konkurrenz von Mobilinga<ul>
<li>Repetico</li>
<li><a href="http://www.phase-6.com/">Phase 6</a></li>
<li><a href="http://babbel.com/">Babbel</a></li>
</ul>
</li>
<li>OmniFocus 2</li>
</ul>
</article>

		</section>
		<nav class="m-navigation">
		<ul>
	<li class="file">
	<a href="Bookmarks">Bookmarks</a>
	</li>
	<li class="file">
	<a href="Find%20launch%20items">Find launch items</a>
	</li>
	<li class="file">
	<a href="Finds">Finds</a>
	</li>
	<li class="file active">
	<a href=".">Google</a>
	</li>
	<li class="file">
	<a href="Lumos">Lumos</a>
	</li>
	<li class="file">
	<a href="OSX%20TODO">OSX TODO</a>
	</li>
	<li class="file">
	<a href="Snippets">Snippets</a>
	</li>
	<li class="file">
	<a href="TabAttack">TabAttack</a>
	</li>
	<li class="file">
	<a href="TV%20and%20Movies">TV and Movies</a>
	</li>
</ul>
		</nav>
	</div>
</div>
*/