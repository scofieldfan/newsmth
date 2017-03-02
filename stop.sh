ps -ef | grep node | grep "crawler_jiudian" | awk '{print $2}' | xargs kill -9
