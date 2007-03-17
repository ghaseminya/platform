/***************************************************************************
 * Copyright 2001-2003 The eXo Platform SARL         All rights reserved.  *
 * Please look at license.txt in info directory for more license detail.   *
 **************************************************************************/
package org.exoplatform.portal.component.customization;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import org.exoplatform.organization.webui.component.UIPermissionSelector;
import org.exoplatform.portal.component.UIPortalApplication;
import org.exoplatform.portal.component.view.PortalDataModelUtil;
import org.exoplatform.portal.component.view.UIPortal;
import org.exoplatform.portal.component.view.Util;
import org.exoplatform.portal.config.UserPortalConfig;
import org.exoplatform.portal.config.model.PortalConfig;
import org.exoplatform.services.resources.LocaleConfig;
import org.exoplatform.services.resources.LocaleConfigService;
import org.exoplatform.webui.application.Application;
import org.exoplatform.webui.application.RequestContext;
import org.exoplatform.webui.component.UIComponentDecorator;
import org.exoplatform.webui.component.UIForm;
import org.exoplatform.webui.component.UIFormInputItemSelector;
import org.exoplatform.webui.component.UIFormInputSet;
import org.exoplatform.webui.component.UIFormSelectBox;
import org.exoplatform.webui.component.UIFormStringInput;
import org.exoplatform.webui.component.UIFormTabPane;
import org.exoplatform.webui.component.UIPopupWindow;
import org.exoplatform.webui.component.lifecycle.UIFormLifecycle;
import org.exoplatform.webui.component.model.SelectItemCategory;
import org.exoplatform.webui.component.model.SelectItemOption;
import org.exoplatform.webui.component.validator.EmptyFieldValidator;
import org.exoplatform.webui.component.validator.NameValidator;
import org.exoplatform.webui.config.Component;
import org.exoplatform.webui.config.annotation.ComponentConfig;
import org.exoplatform.webui.config.annotation.EventConfig;
import org.exoplatform.webui.event.Event;
import org.exoplatform.webui.event.EventListener;
/**
 * Author : Dang Van Minh
 *          minhdv81@yahoo.com
 * Jun 19, 2006
 */
@ComponentConfig(
    lifecycle = UIFormLifecycle.class,
    template = "system:/groovy/webui/component/UIFormTabPane.gtmpl",    
    events = {
      @EventConfig(listeners = UIPortalForm.CancelActionListener.class),
      @EventConfig(listeners = UIPortalForm.SaveActionListener.class)
    }
)
public class UIPortalForm extends UIFormTabPane {

  private static final String SKIN = "skin";
  private PortalConfig portalConfig_;
  private List<SelectItemOption<String>> languages = new ArrayList<SelectItemOption<String>>() ;
  
  private static String DEFAULT_FACTORY_ID = "default";
  

  @SuppressWarnings("unchecked")
  public UIPortalForm() throws Exception {
    super("UIPortalForm");
    LocaleConfigService localeConfigService  = getApplicationComponent(LocaleConfigService.class) ;
    Collection listLocaleConfig = localeConfigService.getLocalConfigs() ;

    Iterator iterator = listLocaleConfig.iterator() ;
    while(iterator.hasNext()) {
      LocaleConfig localeConfig = (LocaleConfig) iterator.next() ;
      languages.add(new SelectItemOption<String>(localeConfig.getLanguage(), localeConfig.getLanguage())) ;
    }

    UIFormInputSet uiSettingSet = new UIFormInputSet("PortalSetting") ;
    uiSettingSet.addUIFormInput(new UIFormStringInput("owner", "owner", null).
                                addValidator(EmptyFieldValidator.class).
                                addValidator(NameValidator.class).
                                setEditable(false)).
                 addUIFormInput(new UIFormSelectBox("locale", "locale", languages).
                                addValidator(EmptyFieldValidator.class))
                 ;
    List<SelectItemOption<String>> ls = new ArrayList<SelectItemOption<String>>() ;
    ls.add(new SelectItemOption<String>("default", "default")) ;
    ls.add(new SelectItemOption<String>("mac", "mac")) ;
    ls.add(new SelectItemOption<String>("vista", "vista")) ;
    UIFormSelectBox uiSelectBox = new UIFormSelectBox(SKIN, SKIN, ls) ;
    uiSettingSet.addUIFormInput(uiSelectBox);
    addUIFormInput(uiSettingSet);    
    
    Application app  = RequestContext.<RequestContext>getCurrentInstance().getApplication() ; 
    List<Component> configs = app.getConfigurationManager().getComponentConfig(UIPortalApplication.class);    
    List<SelectItemCategory>  itemCategories = new ArrayList<SelectItemCategory>();
    for(Component ele : configs){      
      String id =  ele.getId();
      if(id == null) id = DEFAULT_FACTORY_ID;
      StringBuilder builder = new StringBuilder(id);
      builder.setCharAt(0, Character.toUpperCase(builder.charAt(0)));
      String upId = builder.toString();
      
      SelectItemCategory category = new SelectItemCategory(upId);
      itemCategories.add(category);
      List<SelectItemOption<String>> items = new ArrayList<SelectItemOption<String>>() ;
      category.setSelectItemOptions(items);
      SelectItemOption<String> item = new SelectItemOption<String>(id, id, "Portal"+upId);
      items.add(item);     
    }  
    UIFormInputItemSelector uiFactoryId = new UIFormInputItemSelector("FactoryId", "factoryId");
    uiFactoryId.setItemCategories(itemCategories);
    uiFactoryId.setRendered(false);
    addUIFormInput(uiFactoryId);
    
    UIPermissionSelector uiPermissionSelector = createUIComponent(UIPermissionSelector.class, null, null);
    uiPermissionSelector.configure("Permission", null, null) ;
    uiPermissionSelector.setRendered(false);
    addUIComponentInput(uiPermissionSelector) ;
  }
  
  public PortalConfig getPortalConfig() { return portalConfig_; }
  
  public void processRender(RequestContext context) throws Exception {
    super.processRender(context);   
       
    UIPermissionSelector uiPermissionSelector = getChild(UIPermissionSelector.class);    
    if(uiPermissionSelector == null) return;
    UIPopupWindow uiPopupWindow = uiPermissionSelector.getChild(UIPopupWindow.class);
    uiPopupWindow.processRender(context);
  }

  public void setValues(PortalConfig uiPortal) throws Exception {
    portalConfig_ = uiPortal;
    if(portalConfig_.getFactoryId() == null) portalConfig_.setFactoryId(DEFAULT_FACTORY_ID);    
    invokeGetBindingBean(portalConfig_) ;
    UIPermissionSelector uiPermissionSelector = getChild(UIPermissionSelector.class);
    uiPermissionSelector.createPermission("ViewPermission", portalConfig_.getViewPermission());
    uiPermissionSelector.createPermission("EditPermission", portalConfig_.getEditPermission());
  }

  static public class SaveActionListener  extends EventListener<UIPortalForm> {
    public void execute(Event<UIPortalForm> event) throws Exception {
      UIPortalForm uiForm  =  event.getSource();
      String locale = uiForm.getUIStringInput("locale").getValue() ;
      LocaleConfigService localeConfigService  = uiForm.getApplicationComponent(LocaleConfigService.class) ;
      LocaleConfig localeConfig = localeConfigService.getLocaleConfig(locale);
      UIPortalApplication uiApp = uiForm.getAncestorOfType(UIPortalApplication.class);
      PortalConfig portalConfig  = uiForm.getPortalConfig();
      uiForm.invokeSetBindingBean(portalConfig);
      if(portalConfig.getFactoryId().equals(UIPortalForm.DEFAULT_FACTORY_ID)) portalConfig.setFactoryId(null);      
      if(localeConfig == null) localeConfig = localeConfigService.getDefaultLocaleConfig();
      uiApp.setLocale(localeConfig.getLocale());
      
      UIPermissionSelector uiPermissionSelector = uiForm.getChild(UIPermissionSelector.class);
      portalConfig.setViewPermission(uiPermissionSelector.getPermission("ViewPermission").getValue());
      portalConfig.setEditPermission(uiPermissionSelector.getPermission("EditPermission").getValue());
      
      event.getRequestContext().addUIComponentToUpdateByAjax(uiForm);
      
      UIPortal uiPortal = Util.getUIPortal();
      uiPortal.getChildren().clear();
      UserPortalConfig userPortalConfig = uiPortal.getUserPortalConfig();
      userPortalConfig.setPortal(portalConfig);
      PortalDataModelUtil.toUIPortal(uiPortal, userPortalConfig, true);
    }
  }
  
  static public class CancelActionListener  extends EventListener<UIForm> {
    public void execute(Event<UIForm> event) throws Exception {
      UIForm uiForm = event.getSource();
      UIComponentDecorator uiParent = uiForm.getParent();
      uiParent.setUIComponent(null);
      event.getRequestContext().addUIComponentToUpdateByAjax(uiParent);
    }
  }

}
