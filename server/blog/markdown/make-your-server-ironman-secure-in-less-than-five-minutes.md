Make Your Server Ironman-Secure in Less Than Five Minutes



<blockquote><a href="http://o2js.com/assets/hacker.jpg"><img src="http://o2js.com/assets/hack.png" style="float:left;margin:0.5em"></a>

After [setting up your server][the-setup], the next thing would be to
**decrease its attack surface**, and make it harder for unauthorized people
to access it.

<div style="clear:both"></div>

We will do this two-fold:

<ul><li>First, we will **disable password authentication** to protect the server
against  [brute-force password cracking attacks][brute-force];</li>
<li>Then we will **configure our firewall** to only enable access to ports that are in use.</li>
<ul>
</blockquote>

In this tutorial, I will be using an [Ubuntu 13.04][ubuntu] for the server and
a **Mac OSX** for the client. The steps you would follow will more or less be
identical in any linux flavor. If you are using a windows client, you might
want to use a shell emulator, such as [cygwin][cygwin].

> **Danger Zone**:
>
> If you mess things up when following this tutorial, you might lose the ability to remotely connect to your server.  So make sure your hosting
> provider gives you alternative ways to access to your server for emergencies.
> This can be a virtual console such as [lish][lish]; or you might need to open
> a support ticket to your hosting provider.
>
> And always **backup everything** before touching them.

So let's begin by securing our authentication mechanism first:

[the-setup]:   http://o2js.com/the-setup
[brute-force]: https://securityledger.com/2012/12/new-25-gpu-monster-devours-passwords-in-seconds/
[lish]:        https://www.linode.com/linodes/
[ubuntu]:      http://ubuntu.com
[cygwin]:      http://www.cygwin.com/

### Disabling Password Authentication

Go to your **.ssh** directory under your home folder. If there is no **.ssh**
directory, just create one.

~~~
[user@macbook:~]$ cd ~/.ssh
~~~

If there are files in the folder back them up, just in case:

~~~
[user@macbook:~]$ mkdir backup
[user@macbook:~]$ cp id_rsa backup/id_rsa
[user@macbook:~]$ cp id_rsa.pub backup/id_rsa.pub
[user@macbook:~]$ cp known_hosts backup/known_hosts
~~~

After having backed up the **.ssh** folder contents, let's create a key pair:

~~~
[user@macbook:~]$ ssh-keygen
~~~

Answer all the questions prompted. Generally accepting the defaults by
pressing enter is okay.

> You might want to set a password if you are extra
paranoid, but you don't need to. So when you are asked for a password, just
press enter.

This will generate a [private-public key pair][crypto] for you.

* **~/.ssh/id_rsa.pub** is your **public key**, you can freely distribute it.
* **~/.ssh/id_rsa** is your **private key**, this should remain secret.

> The interested reader might want to look at this article about
[how an asymmetric cryptography a day can lock robsters away][asymetric].

Just another warning before moving further: **make sure to backup your keys in a trusted place**.

> Copy your **id_rsa**, and **id_rsa.pub** to an external place that you trust
> so that if your hard drive crashes you could be able to get your keys back.
> I store my backup keys in a [truecrypt][truecrypt] volume in my [Dropbox][dropbox].

Now, let's copy our public key over the wire.

~~~
[user@macbook:~]$ scp id_rsa.pub root@myserver:/root/id_rsa.pub
~~~

> In this example, I' using the root account, which is [bad][root-login].
>
> You might think that logging in as root should be safe, as long as you know
> what you are doing. Similarly, you can also ride a motorcycle in
> the nude, and nothing may happen. But I bet you'd feel better
> if you had your armor jacket, vest, and helmet on when you crash the bike.

So ideally you would also like to

* Create a regular user;
* [Disable remote root login][disable-root];
* And login with that regular user's account.

I will be using **root** account for the sake of simplicity; just keep in mind that
it is a **bad practice** to do so.

Back to our server:

~~~
[user@macbook:~]$ ssh root@myserver
[root@myserver:~]$ touch .ssh/authorized_keys
[root@myserver:~]$ cd /root/
[root@myserver:~]$ cat id_rsa.pub >> .ssh/authorized_keys
[root@myserver:~]$ service ssh restart
[root@myserver:~]$ exit
~~~

This will enable us to login with our private key, without using a password.
So…

~~~
[user@macbook:~]$ ssh root@myserver
~~~

will log you in without asking for any password if you've set things up correctly.

The next step is to **disable password authentication**.

> **Danger Zone**:
>
> Make sure that you can `ssh root@myserver` without entering your password
> before proceeding further; or you will lose access to your server.
>
> You can use 
>
>`ssh root@myserver -v` 
>
> to peek at what's going on and make sure that your public key is being used by the server.

Now that our **SSH** is set up; let's make our server even more secure:

~~~
[user@macbook:~]$ ssh root@myserver
[root@myserver:~]$ vim /etc/ssh/sshd_config
~~~~

Find the line that starts with `PasswordAuthentication` and replace that line with:

~~~
PasswordAuthentication no
~~~

Save and exit by `:wq`. And then restart the **ssh** service:

~~~
[root@myserver:~]$ service ssh restart
[root@myserver:~]$ exit
~~~

After all these set, the only way to log in to your server for a malicious hacker is to gain an access to your private key. 

This will protect you against **brute force password cracking** attempts. 

However, we are not done yet. Let us fortify our network too:

[disable-root]: http://askubuntu.com/questions/27559/how-do-i-disable-remote-ssh-login-as-root-from-a-server
[root-login]: http://askubuntu.com/questions/16178/why-is-it-bad-to-run-as-root
[dropbox]:    http://dropbox.com
[truecrypt]:  http://www.truecrypt.org/
[crypto]:     http://en.wikipedia.org/wiki/Public-key_cryptography
[asymetric]:  http://arstechnica.com/security/2013/02/lock-robster-keeping-the-bad-guys-out-with-asymmetric-encryption/

### Configuring the Firewall

Although there are **GUI** tools like [firestarter][firestarter] to configure your firewall, sooner or later you will find yourself in need to use the command line to set up your firewall. 

And firewall configuration from the command line is easy:

~~~
[user@macbook:~]$ ssh root@myserver
[root@myserver:~]$ iptables -L
~~~

The above command will list the available firewall rules. If you haven't set up anything yet, you will see something like:

~~~
Chain INPUT (policy ACCEPT)
target     prot opt source               destination

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination
~~~

This is an empty set of rules.

> **Danger Zone**:
>
> Remember that the worst that could happen at this stage is that you might
> get locked out of your machine.
> If that happens, either reboot your machine, or connect by some other means
> to clear the rules chain.
> To clear all the rules, and reset the firewall to its initial state, just
> enter:
>
> `iptables -F`

The first thing is, we would want to keep connections that are already established:

~~~
[root@myserver:~]$ iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
~~~

Then we would allow every connection from the local machine (*i.e. the loopback interface*):

~~~
[root@myserver:~]$ iptables -A INPUT -i lo -j ACCEPT
[root@myserver:~]$ iptables -A INPUT -d 127.0.0.0/8 -j REJECT
~~~

The above rule accepts every connection to the localhost (*127.0.0.1*) and rejects any other loopback (*lo*) address (*127.0.0.0/8* means everything between *127.0.0.0* and *127.255.255.255*).

Now, grant access to the ports that you need:

~~~
[root@myserver:~]$ iptables -A INPUT -p tcp --dport 22 -j ACCEPT
[root@myserver:~]$ iptables -A INPUT -p tcp --dport 80 -j ACCEPT
[root@myserver:~]$ iptables -A INPUT -p tcp --dport 443 -j ACCEPT
[root@myserver:~]$ iptables -A INPUT -p tcp --dport 8000 -j ACCEPT
~~~

(*22 is **SSH**, 80 is **HTTP**, 443 is **HTTPS**, and 8000 is my blog publish port*)

You might also want to allow all outbound traffic:

~~~
[root@myserver:~]$ iptables -A OUTPUT -j ACCEPT
~~~

And optionally allow ping:

~~~
[root@myserver:~]$ iptables -A INPUT -p icmp -j ACCEPT
~~~

And then revoke access from everything else:

~~~
[root@myserver:~]$ iptables -A INPUT -j DROP
[root@myserver:~]$ iptables -A FORWARD -j DROP
~~~

### Restoring Firewall State At Reboot

We've setup our firewall, and we are not done yet; because when we reboot our server, all of those rules will be erased. To solve this problem, first create a backup of the rules:

~~~
[root@myserver:~]$ iptables-save > /root/rules.backup
~~~

Then backup your **/etc/rc.local** file:

~~~
[root@myserver:~]$ cp /etc/rc.local /etc/rc.local.backup
~~~

Then edit your **/etc/rc.local**:

~~~
[root@myserver:~]$ vim /etc/rc.local
~~~

and add this line:

~~~
iptables-restore < /root/rules.backup
~~~

This will apply the rules after the server reboots.

### Conclusion

In this article, we've learned how to make our linux box bulletproof by:

* Configuring **SSH**;
* Disabling **SSH** password authentication;
* Configuring our firewall using `iptables`;
* Backing up our firewall configuration using `iptables-save`;
* And restoring the firewall configuration by editing `/etc/rc.local` and using `iptables-restore`.

> What tricks do you have to make your server secure, in your sleeve?
>
> I'd love to hear them.

[firestarter]: http://www.fs-security.com/
