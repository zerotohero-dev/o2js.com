Poor Man’s Server Backup Solution



<img src="http://o2js.com/assets/data.jpg" style="float:left;margin:2em;">


I’ll share a quick tip that helped me to solve my “backup and restore” problem with zero cost and 100% reliability. 

<div style="clear:both"></div>

In this quickie, we will be:

* Writing a basic backup script to **[rsync][rsync]** our project files; 
* **Dump** our databases; 
* **Save** important configuration files;
* **Publish** everything to a [private GitHub repository][github-plans];
* And configure a **[crontab][crontab]** to automate the entire process.

[rsync]:   http://rsync.samba.org/
[crontab]: http://en.wikipedia.org/wiki/Cron

### The Remote Backup Repository

So let’s first start with creating a [blank private **GitHub** repo][github-plans]; and then clone it on our server:

~~~
$ cd ~/BACKUPS
$ git clone git@github.com:user/server-backup.git
~~~

> Before going any further here are a few remarks:
>
> 1. **This is an experimental setup**. In an unlikely case that your private repository is compromised, so will your backup data be. So **use it at your own risk**;
> 2. Make sure that you use the **[SSH clone url][ssh-clone-url]** when doing your clone, so that we will be able to push to the repo without requiring a password; this will also help us automate things;
> 3. Also make sure that this is a **[private][github-plans]** repository. You would not want to share your server configuration with the rest of the world **;)**.
>
> Having said that, I’ve been using it for the last couple of months, and it works like a charm.

[github-plans]: https://github.com/pricing
[ssh-clone-url]: https://help.github.com/articles/which-remote-url-should-i-use

### The Backup Script

Now let’s create a simple shell script to back everything up:

~~~
# ~/BACKUPS/server-backup/backup.sh

cd ~/BACKUPS/server-backup;
iptables-save > iptables.txt;
crontab -l > crontab.txt;
rsync -rtv --exclude ".git" ~/webs/ ~/BACKUPS/server-backup/webs
rsync -rtv /etc/apache2/sites-available ~/BACKUPS/server-backup/sites-available
cp /etc/apache2/apache2.conf ~/BACKUPS/server-backup/apache2.conf
cp /etc/nginx/nginx.conf ~/BACKUPS/server-backup/nginx.conf
mysqldump -uroot -pdasecretpassword db > db.sql
mongodump
git add .
git commit -m 'backup.'
git push origin master
echo "Done!"
~~~

Which…

* Backs up firewall configuration;
* Backs up the crontab<br>
(*for the clumsy dev-op who messes up with the crontab, and forgets to back it up before she starts*);
* Backs up all of the websites;
* Backs up [apache][apache] and [Nginx][nginx] configurations;
* Dumps [MySQL][mysql] databases;
* And dumps [MongoDB][mongodb].

And then adds everything to git, and commits it to the **origin**.

> **Caveat**: If you have anything that’s more than 100MB, [GitHub will not allow you to push it][github-file-size-limitation]. If you have very large files, you might either want to exclude them from the backup, or split them, or compress them.

We are almost done. 

Finally, let’s automate this process by creating a [crontab][crontab] entry.

[github-file-size-limitation]: https://help.github.com/articles/what-is-my-disk-quota

### Setting the [crontab][crontab]

Editing the [crontab][crontab] is really easy:

Just run

~~~
crontab -e
~~~

And add the following line to the upcoming document, and save it.

~~~
0 0 * * * /userprofile/BACKUPS/backups/backup.sh > /userprofile/cronout.txt 2>&1
~~~

> **Hint**: Remember to leave an empty line at the end of the file.

This will create a [crontab][crontab] entry and schedule our backup script to run at every midnight. 

And in case anything goes wrong, the output of the last run will be saved to **/userprofile/cronout.txt**.

[apache]:  http://httpd.apache.org/
[mongodb]: http://www.mongodb.org/
[nginx]:   http://wiki.nginx.org/Main
[mysql]:   http://www.mysql.com/

### Conclusion

We have created a reliable backup solution in less than five minutes!

It’s really easy to keep versioned backups of your important files at **[GitHub][github]**. 

More important than that, **[GitHub][github]** allows you to have great web interface where you can do full-text search,  diff your data and your files.

And best of it; you won’t need to pay for a full-blown backup server.

Enjoy!<br>
And please share if you have other backup solutions that you use;<br>
I’d love to hear about them.

[github]: https://github.com/
