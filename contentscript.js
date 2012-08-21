function debug(x) {
	console.log(x);
}

$('.book-cart-app-notice').before('<div class="gray_ad" id="szulib"></div>');
$('#szulib').append('<h2>深大图书馆馆藏情况   · · · · · · </h2><div class="bs" id="isex">正在查找...</div>');
if (typeof($('#info').text().split('ISBN:')[1]) != 'undefined') {
	var isbn = $('#info').text().split('ISBN:')[1].split(' ')[1];
	$.get("http://www.weixiaoyuan.com/html5/lib_search?type=isbn_f&keyword="+isbn, function(data) {
		debug("search result " + data);
		data = eval("(" + data + ")");
		if (data.exist == 1) {
			for (var book in data.books) {
				$.get("http://www.weixiaoyuan.com/html5/lib_detail?id="+data.books[book].id, function(book_info) {
					debug("book info " + book_info);
					book_info = eval("(" + book_info + ")");
					var status = "<ul class='bs'>";
					for (var record in book_info.records) {
						status += "<li>" + book_info.records[record].address + "&nbsp;&nbsp;&nbsp;" + book_info.records[record].status + "</li>";
					}
					status += "</ul>";
					$('#isex').html(status);
				});
			}
		} else {
			var book_title = $("h1").find("span").text();			
			debug("fuzzy matching " + book_title);
			$.get("http://www.weixiaoyuan.com/html5/lib_search?type=anywords&keyword="+book_title, function(book_summarys) {
				debug(book_summarys);
				book_summarys = eval("(" + book_summarys + ")");
				if (book_summarys.exist == 1) {
					var book_titles = "<ul class='bs'>";
					for (var i=0; i<book_summarys.books.length; i++) {
						book_titles += '<li><a target="_blank" href="http://opac.lib.szu.edu.cn/opac/bookinfo.aspx?ctrlno='+book_summarys.books[i].id+'">' + book_summarys.books[i].title + "</a>(可借：" + book_summarys.books[i].borrow + ")</li>";
					}
					book_titles += "</ul>";
					$('#isex').html('没有 ISBN 精确匹配结果，同名模糊匹配得到：' + book_titles);
				} else {
					$('#isex').html('没有找到这本图书，你可以<a href="http://opac.lib.szu.edu.cn/opac/readerrecommend.aspx" target="_blank">向图书馆荐购</a>');
				}
			});			
		}
	});	
} else {
	$('#isex').html('没有找到这本图书');
}