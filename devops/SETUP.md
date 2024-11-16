To setup the proxy: 

1. Add inbound rules in VM (ingress rules to allow 433, 80, 5000)
```
# Then
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp
sudo ufw allow 5000/tcp
sudo ufw status
```

Test a tmux session with 
```
tmux new -s my_session
tmux attach -t my_session
python3 app.py # in session
# Ctrl-B
```

If persistence test complete, continue to step 2. 

2. Add gunicorn to bind to 0.0.0.0 (public IP)
```
# add everythingcalendar.conf
sudo nano /etc/supervisor/conf.d/everythingcalendar.conf
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl restart everythingcalendar
```

Make sure http://40.233.73.84:5000 works (binded port runs on public IP)

3. Add nginx to listen from a custom port
```
# Add backend.conf to below
sudo nano /etc/nginx/sites-available/everythingcalendar
sudo nginx -t
sudo systemctl restart nginx
```

Now, http://40.233.73.84 should show the backend (not the default NGINX message, if this is wrong, VM config issue).

Now, we register domain information and connect. 

4. Register domain records

Point an A or CNAME record from backend.everythingcalendar.org to public ip (40.233.73.84). 

Now, http://backend.everythingcalendar.org should work. 

5. Add a SSL certificate to expose HTTPS
```
sudo certbot --nginx -d backend.everythingcalendar.org -d www.backend.everythingcalendar.org
sudo certbot renew --dry-run
# Modify backend.conf with pem keys (in nginx/backend.conf)
```

Now, https://backend.everythingcalendar.org should work

5. Test

Go to SSL Labs (https://www.ssllabs.com/ssltest/) to test validity of https 
Go to nginx logs `sudo tail -f /var/log/everythingcalendar.err.log` to make sure there are no errors. 
